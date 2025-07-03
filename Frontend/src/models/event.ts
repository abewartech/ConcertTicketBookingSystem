export interface IEventData {
    _id: string;
    eventName: string;
    companyId: string;
    proposedDates: Date[];
    proposedLocation: {
        lat: number;
        lng: number;
    };
    status: 'Pending' | 'Approved' | 'Rejected';
    vendorId: IVendorData;
    confirmedDate?: Date;
    remarks?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IVendorData {
    _id: string;
    vendorName: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

