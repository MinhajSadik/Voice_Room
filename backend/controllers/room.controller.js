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

  async index(req, res) {
    const rooms = await roomService.getAllRooms(["open"]);

    const allRooms = rooms.map((room) => new RoomDto(room));

    return res.json(allRooms);
  }

  async show(req, res) {
    const room = await roomService.getRoom(req.params.roomId);

    return res.json(room);
  }
}

export default new RoomController();
