interface USPSConfig {
  clientId: string;
  clientSecret: string;
  customerId?: string;
  mailerId?: string;
  isSandbox?: boolean;
}

interface USPSTokenResponse {
  access_token: string;
  token_type: string;
  issued_at: string;
  expires_in: string;
}

interface USPSRateRequest {
  originZIPCode: string;
  destinationZIPCode: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  mailClass?: string;
  priceType?: string;
  mailingDate?: string;
}

interface USPSRate {
  mailClass: string;
  serviceName: string;
  price: number;
  zone: string;
  deliveryDays?: number;
  estimatedDelivery?: string;
}

class USPSClient {
  private config: USPSConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private baseUrl: string;

  constructor(config: USPSConfig) {
    this.config = config;
    this.baseUrl = config.isSandbox
      ? "https://apis-tem.usps.com"
      : "https://apis.usps.com";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const tokenUrl = `${this.baseUrl}/oauth2/v3/token`;
    const params = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    if (this.config.customerId) {
      params.append("customer_registration_id", this.config.customerId);
    }
    if (this.config.mailerId) {
      params.append("mailer_id", this.config.mailerId);
    }

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`USPS OAuth failed: ${error}`);
    }

    const data: USPSTokenResponse = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + parseInt(data.expires_in) * 1000 - 60000);

    return this.accessToken;
  }

  async getRates(request: USPSRateRequest): Promise<USPSRate[]> {
    const token = await this.getAccessToken();
    
    const mailClasses = ["PRIORITY_MAIL", "PRIORITY_MAIL_EXPRESS", "USPS_GROUND_ADVANTAGE", "PARCEL_SELECT"];
    const rates: USPSRate[] = [];

    for (const mailClass of mailClasses) {
      try {
        const rateUrl = `${this.baseUrl}/prices/v3/base-rates/search`;
        const payload = {
          originZIPCode: request.originZIPCode,
          destinationZIPCode: request.destinationZIPCode,
          weight: request.weight,
          length: request.length,
          width: request.width,
          height: request.height,
          mailClass: mailClass,
          priceType: request.priceType || "RETAIL",
          mailingDate: request.mailingDate || new Date().toISOString().split("T")[0],
        };

        const response = await fetch(rateUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.price) {
            rates.push({
              mailClass: mailClass,
              serviceName: this.getServiceName(mailClass),
              price: parseFloat(data.price),
              zone: data.zone || "N/A",
              deliveryDays: data.deliveryDays,
              estimatedDelivery: data.deliveryDate,
            });
          }
        }
      } catch (error) {
        console.error(`USPS rate error for ${mailClass}:`, error);
      }
    }

    return rates;
  }

  private getServiceName(mailClass: string): string {
    const serviceNames: Record<string, string> = {
      "PRIORITY_MAIL": "USPS Priority Mail",
      "PRIORITY_MAIL_EXPRESS": "USPS Priority Mail Express",
      "USPS_GROUND_ADVANTAGE": "USPS Ground Advantage",
      "PARCEL_SELECT": "USPS Parcel Select",
      "MEDIA_MAIL": "USPS Media Mail",
    };
    return serviceNames[mailClass] || mailClass;
  }

  async createLabel(request: {
    fromAddress: {
      name: string;
      company?: string;
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zip: string;
    };
    toAddress: {
      name: string;
      company?: string;
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zip: string;
    };
    weight: number;
    mailClass: string;
    length: number;
    width: number;
    height: number;
  }): Promise<{
    trackingNumber: string;
    labelData: string;
    cost: number;
  }> {
    const token = await this.getAccessToken();
    const labelUrl = `${this.baseUrl}/labels/v3/label`;

    const payload = {
      imageInfo: {
        imageType: "PDF",
        labelType: "4X6LABEL",
      },
      fromAddress: {
        streetAddress: request.fromAddress.street1,
        secondaryAddress: request.fromAddress.street2 || "",
        city: request.fromAddress.city,
        state: request.fromAddress.state,
        ZIPCode: request.fromAddress.zip,
        firstName: request.fromAddress.name,
        lastName: "",
        firm: request.fromAddress.company || "",
      },
      toAddress: {
        streetAddress: request.toAddress.street1,
        secondaryAddress: request.toAddress.street2 || "",
        city: request.toAddress.city,
        state: request.toAddress.state,
        ZIPCode: request.toAddress.zip,
        firstName: request.toAddress.name,
        lastName: "",
        firm: request.toAddress.company || "",
      },
      packageDescription: {
        weight: request.weight,
        length: request.length,
        width: request.width,
        height: request.height,
        mailClass: request.mailClass,
      },
    };

    const response = await fetch(labelUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`USPS label creation failed: ${error}`);
    }

    const data = await response.json();
    return {
      trackingNumber: data.trackingNumber,
      labelData: data.labelImage,
      cost: parseFloat(data.postage || "0"),
    };
  }

  async trackPackage(trackingNumber: string): Promise<{
    status: string;
    statusDetail: string;
    location: string;
    timestamp: string;
    events: Array<{ status: string; location: string; timestamp: string }>;
  }> {
    const token = await this.getAccessToken();
    const trackUrl = `${this.baseUrl}/tracking/v3/tracking/${trackingNumber}`;

    const response = await fetch(trackUrl, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`USPS tracking failed: ${error}`);
    }

    const data = await response.json();
    const latestEvent = data.trackingEvents?.[0] || {};

    return {
      status: latestEvent.eventType || "Unknown",
      statusDetail: latestEvent.eventDescription || "",
      location: latestEvent.eventCity ? `${latestEvent.eventCity}, ${latestEvent.eventState}` : "",
      timestamp: latestEvent.eventTimestamp || "",
      events: (data.trackingEvents || []).map((e: any) => ({
        status: e.eventDescription || "",
        location: e.eventCity ? `${e.eventCity}, ${e.eventState}` : "",
        timestamp: e.eventTimestamp || "",
      })),
    };
  }
}

export function createUSPSClient(): USPSClient | null {
  const clientId = process.env.USPS_CLIENT_ID;
  const clientSecret = process.env.USPS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  return new USPSClient({
    clientId,
    clientSecret,
    customerId: process.env.USPS_CUSTOMER_ID,
    mailerId: process.env.USPS_MAILER_ID,
    isSandbox: process.env.USPS_SANDBOX === "true",
  });
}

export { USPSClient, USPSRate, USPSRateRequest };
