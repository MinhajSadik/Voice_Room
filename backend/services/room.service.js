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
}

export default new RoomService();
