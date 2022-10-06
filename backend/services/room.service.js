import RoomModel from "../models/room.model.js";
class RoomService {
  async create(payload) {
    const { topic, roomType, ownerId } = payload;

    const room = await RoomModel.create({
      topic,
      roomType,
      ownerId,
      speakers: [ownerId],
    });
    return room;
  }

  async getAllRooms(types) {
    const rooms = await RoomModel.find({ roomType: { $in: types } })
      .populate("speakers")
      .populate("ownerId")
      .exec();
    return rooms;
  }
}

export default new RoomService();
