export const validateElectricity = (data: { monthlyUsageKwh: string; renewablePercentage: string }) => {
    const errors: Record<string, string> = {};
    if (!data.monthlyUsageKwh || isNaN(Number(data.monthlyUsageKwh))) {
        errors.monthlyUsageKwh = "Usage must be a number";
    } else if (Number(data.monthlyUsageKwh) < 0) {
        errors.monthlyUsageKwh = "Usage cannot be negative";
    }

    const renew = Number(data.renewablePercentage);
    if (isNaN(renew) || renew < 0 || renew > 100) {
        errors.renewablePercentage = "Must be between 0 and 100";
    }
    return errors;
};

export const validateFuel = (data: {
    naturalGasThermsPeYear: string;
    heatingOilGallonsPerYear: string;
    propaneGallonsPerYear: string
}) => {
    const errors: Record<string, string> = {};
    if (isNaN(Number(data.naturalGasThermsPeYear)) || Number(data.naturalGasThermsPeYear) < 0) errors.naturalGasThermsPeYear = "Invalid value";
    if (isNaN(Number(data.heatingOilGallonsPerYear)) || Number(data.heatingOilGallonsPerYear) < 0) errors.heatingOilGallonsPerYear = "Invalid value";
    if (isNaN(Number(data.propaneGallonsPerYear)) || Number(data.propaneGallonsPerYear) < 0) errors.propaneGallonsPerYear = "Invalid value";
    return errors;
};

export const validateTransport = (data: {
    carMilesDrivenPerYear: string;
    flightHoursPerYear: string;
    publicTransitMilesDrivenPerYear: string;
}) => {
    const errors: Record<string, string> = {};
    if (isNaN(Number(data.carMilesDrivenPerYear)) || Number(data.carMilesDrivenPerYear) < 0) errors.carMilesDrivenPerYear = "Invalid value";
    if (isNaN(Number(data.flightHoursPerYear)) || Number(data.flightHoursPerYear) < 0) errors.flightHoursPerYear = "Invalid value";
    if (isNaN(Number(data.publicTransitMilesDrivenPerYear)) || Number(data.publicTransitMilesDrivenPerYear) < 0) errors.publicTransitMilesDrivenPerYear = "Invalid value";
    return errors;
};

export const validateWaterWaste = (data: {
    waterUsageGallonsPerYear: string;
    wasteGeneratedLbsPerYear: string;
    recyclingPercentage: string;
}) => {
    const errors: Record<string, string> = {};
    if (isNaN(Number(data.waterUsageGallonsPerYear)) || Number(data.waterUsageGallonsPerYear) < 0) errors.waterUsageGallonsPerYear = "Invalid value";
    if (isNaN(Number(data.wasteGeneratedLbsPerYear)) || Number(data.wasteGeneratedLbsPerYear) < 0) errors.wasteGeneratedLbsPerYear = "Invalid value";

    const recycle = Number(data.recyclingPercentage);
    if (isNaN(recycle) || recycle < 0 || recycle > 100) {
        errors.recyclingPercentage = "Must be between 0 and 100";
    }
    return errors;
};
