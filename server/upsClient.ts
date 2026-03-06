interface UPSConfig {
  clientId: string;
  clientSecret: string;
  accountNumber?: string;
  isSandbox?: boolean;
}

interface UPSTokenResponse {
  access_token: string;
  token_type: string;
  issued_at: string;
  expires_in: string;
}

interface UPSRateRequest {
  fromAddress: {
    city: string;
    stateCode: string;
    postalCode: string;
    countryCode: string;
  };
  toAddress: {
    city: string;
    stateCode: string;
    postalCode: string;
    countryCode: string;
  };
  weight: number;
  length: number;
  width: number;
  height: number;
}

interface UPSRate {
  serviceCode: string;
  serviceName: string;
  price: number;
  currency: string;
  deliveryDays?: number;
  estimatedDelivery?: string;
}

class UPSClient {
  private config: UPSConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private baseUrl: string;

  constructor(config: UPSConfig) {
    this.config = config;
    this.baseUrl = config.isSandbox
      ? "https://wwwcie.ups.com"
      : "https://onlinetools.ups.com";
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const tokenUrl = `${this.baseUrl}/security/v1/oauth/token`;
    const credentials = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString("base64");

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`UPS OAuth failed: ${error}`);
    }

    const data: UPSTokenResponse = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + parseInt(data.expires_in) * 1000 - 60000);

    return this.accessToken;
  }

  async getRates(request: UPSRateRequest): Promise<UPSRate[]> {
    const token = await this.getAccessToken();
    const rateUrl = `${this.baseUrl}/api/rating/v1/Shop`;

    const payload = {
      RateRequest: {
        Request: {
          SubVersion: "2205",
          TransactionReference: {
            CustomerContext: "Rate Request",
          },
        },
        Shipment: {
          Shipper: {
            Address: {
              City: request.fromAddress.city,
              StateProvinceCode: request.fromAddress.stateCode,
              PostalCode: request.fromAddress.postalCode,
              CountryCode: request.fromAddress.countryCode,
            },
          },
          ShipTo: {
            Address: {
              City: request.toAddress.city,
              StateProvinceCode: request.toAddress.stateCode,
              PostalCode: request.toAddress.postalCode,
              CountryCode: request.toAddress.countryCode,
            },
          },
          ShipFrom: {
            Address: {
              City: request.fromAddress.city,
              StateProvinceCode: request.fromAddress.stateCode,
              PostalCode: request.fromAddress.postalCode,
              CountryCode: request.fromAddress.countryCode,
            },
          },
          Package: {
            PackagingType: {
              Code: "02",
              Description: "Customer Supplied Package",
            },
            Dimensions: {
              UnitOfMeasurement: {
                Code: "IN",
                Description: "Inches",
              },
              Length: String(request.length),
              Width: String(request.width),
              Height: String(request.height),
            },
            PackageWeight: {
              UnitOfMeasurement: {
                Code: "LBS",
                Description: "Pounds",
              },
              Weight: String(request.weight),
            },
          },
        },
      },
    };

    const response = await fetch(rateUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "transId": `rate-${Date.now()}`,
        "transactionSrc": "attaie-cigars",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`UPS rate request failed: ${error}`);
    }

    const data = await response.json();
    const ratedShipments = data.RateResponse?.RatedShipment || [];

    return ratedShipments.map((shipment: any) => ({
      serviceCode: shipment.Service?.Code || "",
      serviceName: this.getServiceName(shipment.Service?.Code || ""),
      price: parseFloat(shipment.TotalCharges?.MonetaryValue || "0"),
      currency: shipment.TotalCharges?.CurrencyCode || "USD",
      deliveryDays: parseInt(shipment.GuaranteedDelivery?.BusinessDaysInTransit || "0") || undefined,
      estimatedDelivery: shipment.GuaranteedDelivery?.DeliveryByTime,
    }));
  }

  private getServiceName(code: string): string {
    const serviceNames: Record<string, string> = {
      "01": "UPS Next Day Air",
      "02": "UPS 2nd Day Air",
      "03": "UPS Ground",
      "12": "UPS 3 Day Select",
      "13": "UPS Next Day Air Saver",
      "14": "UPS Next Day Air Early",
      "59": "UPS 2nd Day Air A.M.",
      "65": "UPS Saver",
    };
    return serviceNames[code] || `UPS Service ${code}`;
  }

  async createShipment(request: {
    fromAddress: {
      name: string;
      company?: string;
      street1: string;
      street2?: string;
      city: string;
      stateCode: string;
      postalCode: string;
      countryCode: string;
      phone: string;
    };
    toAddress: {
      name: string;
      company?: string;
      street1: string;
      street2?: string;
      city: string;
      stateCode: string;
      postalCode: string;
      countryCode: string;
      phone: string;
    };
    weight: number;
    length: number;
    width: number;
    height: number;
    serviceCode: string;
  }): Promise<{
    trackingNumber: string;
    labelData: string;
    cost: number;
  }> {
    const token = await this.getAccessToken();
    const shipUrl = `${this.baseUrl}/api/shipments/v1/ship`;

    const payload = {
      ShipmentRequest: {
        Request: {
          SubVersion: "2205",
          TransactionReference: {
            CustomerContext: "Shipment Request",
          },
        },
        Shipment: {
          Description: "Cigar Products",
          Shipper: {
            Name: request.fromAddress.company || request.fromAddress.name,
            ShipperNumber: this.config.accountNumber,
            Phone: {
              Number: request.fromAddress.phone,
            },
            Address: {
              AddressLine: [request.fromAddress.street1, request.fromAddress.street2 || ""],
              City: request.fromAddress.city,
              StateProvinceCode: request.fromAddress.stateCode,
              PostalCode: request.fromAddress.postalCode,
              CountryCode: request.fromAddress.countryCode,
            },
          },
          ShipTo: {
            Name: request.toAddress.company || request.toAddress.name,
            Phone: {
              Number: request.toAddress.phone,
            },
            Address: {
              AddressLine: [request.toAddress.street1, request.toAddress.street2 || ""],
              City: request.toAddress.city,
              StateProvinceCode: request.toAddress.stateCode,
              PostalCode: request.toAddress.postalCode,
              CountryCode: request.toAddress.countryCode,
            },
          },
          ShipFrom: {
            Name: request.fromAddress.company || request.fromAddress.name,
            Phone: {
              Number: request.fromAddress.phone,
            },
            Address: {
              AddressLine: [request.fromAddress.street1, request.fromAddress.street2 || ""],
              City: request.fromAddress.city,
              StateProvinceCode: request.fromAddress.stateCode,
              PostalCode: request.fromAddress.postalCode,
              CountryCode: request.fromAddress.countryCode,
            },
          },
          PaymentInformation: {
            ShipmentCharge: {
              Type: "01",
              BillShipper: {
                AccountNumber: this.config.accountNumber,
              },
            },
          },
          Service: {
            Code: request.serviceCode,
          },
          Package: {
            Packaging: {
              Code: "02",
            },
            Dimensions: {
              UnitOfMeasurement: {
                Code: "IN",
              },
              Length: String(request.length),
              Width: String(request.width),
              Height: String(request.height),
            },
            PackageWeight: {
              UnitOfMeasurement: {
                Code: "LBS",
              },
              Weight: String(request.weight),
            },
          },
        },
        LabelSpecification: {
          LabelImageFormat: {
            Code: "PDF",
          },
          LabelStockSize: {
            Height: "6",
            Width: "4",
          },
        },
      },
    };

    const response = await fetch(shipUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "transId": `ship-${Date.now()}`,
        "transactionSrc": "attaie-cigars",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`UPS shipment creation failed: ${error}`);
    }

    const data = await response.json();
    const shipmentResult = data.ShipmentResponse?.ShipmentResults;
    const packageResult = shipmentResult?.PackageResults?.[0] || shipmentResult?.PackageResults;

    return {
      trackingNumber: packageResult?.TrackingNumber || shipmentResult?.ShipmentIdentificationNumber || "",
      labelData: packageResult?.ShippingLabel?.GraphicImage || "",
      cost: parseFloat(shipmentResult?.ShipmentCharges?.TotalCharges?.MonetaryValue || "0"),
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
    const trackUrl = `${this.baseUrl}/api/track/v1/details/${trackingNumber}`;

    const response = await fetch(trackUrl, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "transId": `track-${Date.now()}`,
        "transactionSrc": "attaie-cigars",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`UPS tracking failed: ${error}`);
    }

    const data = await response.json();
    const trackResponse = data.trackResponse?.shipment?.[0];
    const pkg = trackResponse?.package?.[0];
    const activities = pkg?.activity || [];
    const latestActivity = activities[0] || {};

    return {
      status: latestActivity.status?.description || "Unknown",
      statusDetail: latestActivity.status?.statusCode || "",
      location: latestActivity.location?.address
        ? `${latestActivity.location.address.city}, ${latestActivity.location.address.stateProvince}`
        : "",
      timestamp: latestActivity.date && latestActivity.time
        ? `${latestActivity.date} ${latestActivity.time}`
        : "",
      events: activities.map((a: any) => ({
        status: a.status?.description || "",
        location: a.location?.address
          ? `${a.location.address.city || ""}, ${a.location.address.stateProvince || ""}`
          : "",
        timestamp: `${a.date || ""} ${a.time || ""}`,
      })),
    };
  }
}

export function createUPSClient(): UPSClient | null {
  const clientId = process.env.UPS_CLIENT_ID;
  const clientSecret = process.env.UPS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  return new UPSClient({
    clientId,
    clientSecret,
    accountNumber: process.env.UPS_ACCOUNT_NUMBER,
    isSandbox: process.env.UPS_SANDBOX === "true",
  });
}

export { UPSClient, UPSRate, UPSRateRequest };
