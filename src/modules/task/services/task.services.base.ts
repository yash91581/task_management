import logger from "../../../commonUtils/winstonLogger";
import { TasksModel } from "../model/task.model";

const taskServices = {
  create: async (data: any) => {
    try {
      const createData = await TasksModel.create(data);
      return createData;
    } catch (taskServiceError) {
      logger.error("taskServiceError :: create :: ", taskServiceError);
    }
  },

  findOne: async (
    condition: any,
    projectionString = "",
    populatedArray: any[] = []
  ) => {
    try {
      const findOneResult = await TasksModel.findOne(
        condition,
        projectionString
      ).populate(populatedArray);

      return findOneResult;
    } catch (taskServiceError) {
      logger.error("taskServiceError :: findOne ::", taskServiceError);
    }
  },

  findAll: async (
    condition: any,
    projectionString = "",
    populatedArray: any[] = []
  ) => {
    try {
      const findAllResult = await TasksModel.find(
        condition,
        projectionString
      ).populate(populatedArray);
      return findAllResult;
    } catch (taskServiceError) {
      logger.error("taskServiceError :: findAll ::", taskServiceError);
    }
  },

  deleteOne: async (condition: any) => {
    try {
      const deleteOneResult = await TasksModel.findOneAndDelete(condition);
      return deleteOneResult;
    } catch (taskServiceError) {
      logger.error("taskServiceError :: deleteOne ::", taskServiceError);
    }
  },

  deleteAll: async (condition: any) => {
    try {
      const deleteManyResult = await TasksModel.deleteMany(condition);
      return deleteManyResult;
    } catch (taskServiceError) {
      logger.error("taskServiceError :: deleteAll ::", taskServiceError);
    }
  },

  update: async (condition: any, updatedData: any) => {
    try {
      const updateResult = await TasksModel.findOneAndUpdate(
        condition,
        { $set: updatedData },
        { new: true }
      );
      return updateResult;
    } catch (taskServiceError) {
      logger.error("taskServiceError :: update ::", taskServiceError);
    }
  },

  softDelete: async (condition: any) => {
    try {
      const softDelete = await TasksModel.updateOne(condition, {
        $set: { isDeleted: true },
      });
      return softDelete;
    } catch (taskServiceError) {
      logger.error("taskServiceError :: softDelete ::", taskServiceError);
    }
  },
};
export default taskServices;
