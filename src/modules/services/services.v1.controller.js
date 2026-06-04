import { Service } from "./service.model.js";

export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ serviceNumber: -1 });
    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    next(error);
  };
};

export const getServiceByNumber  = async (req, res, next) => {
  try {
    const service = await Service.findOne({ serviceNumber: req.params.serviceNumber });
    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    };
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  };
};

export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    };
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  };
};

export const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    return res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  };
};

export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    };
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  };
};

export const updateServiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const service = await Service.findByIdAndUpdate(req.params.id, { status }, { returnDocument: "after", runValidators: true });
    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

export const updateServiceInternalNote = async (req, res, next) => {
  try {
    const { internalNote } = req.body;
    const service = await Service.findByIdAndUpdate(req.params.id, { internalNote }, { returnDocument: "after", runValidators: true });
    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    };
    return res.status(200).json({ success: true, data: service, message: "Service deleted" });
  } catch (error) {
    next(error);
  };
};