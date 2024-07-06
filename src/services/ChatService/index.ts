import { mapToList, genRandomId } from "../../utils";
import { SocketService } from "../../config/dependencies";

export class ChatService {
  isOnline: Boolean = false;
  parties: any = {};
  chatRooms: any = {};
  mainClientId: any = null;

  constructor() {
    SocketService.addEvent({
      register: this.register,
    });
    SocketService.addEvent({
      unregister: this.unregister,
    });
    SocketService.addEvent({
      message: async ({ message, room }: any) => {
        if (!room.parties) return;
        room.parties.forEach(({ partyId }: any) =>
          this.parties[partyId].socket.emit("response", { message, room })
        );
      },
    });
    SocketService.addEvent({
      isOnline: async (isOnline: Boolean) => {
        this.setIsOnline(isOnline);
      },
    });
    SocketService.addEvent({
      updateAlias: async ({ id, alias }: any) => {
        this.parties[id].alias = alias;
        mapToList(this.parties).forEach((party: any) =>
          party.socket.emit("rooms", this.getChatRooms(party.rooms, party.id))
        );
      },
    });
  }
  getIsOnline = () => this.isOnline;
  setIsOnline = (isOnline: Boolean) => {
    this.isOnline = isOnline;
    SocketService.broadCast("isOnline", { isOnline });
  };
  getFlatParties = () =>
    mapToList(this.parties, false).map((party: any) => ({
      id: party[0],
      alias: party[1].alias,
      kind: party[1].kind,
      rooms: party[1].rooms,
    }));
  getFlatPartyById = (flatParties: any, id: any) =>
    flatParties.filter((p: any) => p.id == id)[0];
  getFlatPartyByKind = (flatParties: any, kind: any) =>
    flatParties.filter((p: any) => p.kind == kind)[0];
  register = async ({ id, alias, kind }: any) => {
    console.log({ alias });
    if (this.parties[id] && this.parties[id].kind === kind) return;
    this.parties[id] = {
      id,
      kind,
      alias,
      rooms: [],
      socket: SocketService.sockets[id],
    };
    const host = this.getFlatPartyByKind(this.getFlatParties(), "host");
    if (kind === "guest" && host) {
      this.addChatRoom([this.parties[id], this.parties[host.id]]);
    }
    mapToList(this.parties).forEach((party: any) => {
      if (kind === "host" && party.id !== id) {
        this.addChatRoom([party, this.parties[id]]);
      }
    });
    SocketService.addOnDisconnectEvent((socket: any) => {
      const socketId = socket.handshake.query.id;
      if (this.parties[socketId])
        this.removeFromChatRoom([this.parties[socketId]]);
      delete this.parties[socketId];
      mapToList(this.parties).forEach((party: any) =>
        party.socket.emit("rooms", this.getChatRooms(party.rooms, party.id))
      );
    });
    this.parties[id].socket.emit("isOnline", { isOnline: this.isOnline });
    mapToList(this.parties).forEach((party: any) =>
      party.socket.emit("rooms", this.getChatRooms(party.rooms, party.id))
    );
  };
  unregister = async ({ id }: any) => {
    this.removeFromChatRoom([this.parties[id]]);
    mapToList(this.parties).forEach((party: any) =>
      party.socket.emit("rooms", this.getChatRooms(party.rooms, party.id))
    );
  };
  addChatRoom = (parties: any) => {
    const chatRoomId = genRandomId();
    this.chatRooms[chatRoomId] = [];
    parties.forEach((party: any) => {
      this.chatRooms[chatRoomId] = [...this.chatRooms[chatRoomId], party.id];
      party.rooms = [...party.rooms, chatRoomId];
      this.parties[party.id] = party;
    });
  };
  removeFromChatRoom = (parties: any) => {
    if (!parties) return;
    parties.forEach((party: any) => {
      if (!party.room) return;
      party.rooms.forEach((room: any) => {
        if (!this.chatRooms[room]) return;
        this.chatRooms[room].splice(this.chatRooms[room].indexOf(party.id), 1);
        if (this.chatRooms[room].length < 2) {
          const lastParty = this.parties[this.chatRooms[room][0]];
          lastParty.rooms.splice(lastParty.rooms.indexOf(room), 1);
          delete this.chatRooms[room];
        }
      });
    });
  };
  // ! Use this to generarte a error and see how SocketService handle errors
  getChatRooms = (rooms: any, idsToSkip: any = []) => {
    return rooms.map((roomId: any) => {
      const roomPack: any = { id: roomId, parties: [] };
      if (!this.chatRooms[roomId]) return;
      this.chatRooms[roomId].forEach((partyId: any) => {
        if (idsToSkip.includes(partyId)) return;
        if (!roomPack.parties || !this.parties[partyId]) return;
        roomPack.parties.push({
          partyId,
          partyAlias: this.parties[partyId].alias,
        });
      });
      return roomPack;
    });
  };
}
