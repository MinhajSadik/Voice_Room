import RoomDto from "../dtos/room.dto.js";
import roomService from "../services/room.service.js";

class RoomController {
  async create(req, res) {
    const { topic, roomType } = req.body;

    if (!topic || !roomType) {
      return res.status(400).json({
        message: "Room field's are required",
      });
    }

    const room = await roomService.create({
      topic,
      roomType,
      ownerId: req.user._id,
    });

    return res.json(new RoomDto(room));
  }
}

export default new RoomController();
