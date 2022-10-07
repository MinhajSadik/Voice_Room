// import freeice from "freeice";
// import { useCallback, useEffect, useRef } from "react";
// import { socketInit } from "../socket";
// import { ACTIONS } from "../socket/actions";
// import { useStateWithCallback } from "./useStateWithCallback";

// export const useWebRTC = (roomId, user) => {
//   const [clients, setClients] = useStateWithCallback([]);
//   const audioElements = useRef({});
//   const connections = useRef({});
//   const localMediaStream = useRef(null);
//   const socketRef = useRef(null);
//   const clientsRef = useRef([]);

//   useEffect(() => {
//     socketRef.current = socketInit();
//   }, []);

//   const addNewClient = useCallback(
//     (newClient, cb) => {
//       const lookingFor = clients.find((client) => client.id === newClient);

//       if (lookingFor === undefined) {
//         setClients((prevClients) => [...prevClients, newClient], cb);
//       }
//     },
//     [clients, setClients]
//   );

//   //Capture media
//   useEffect(() => {
//     const startCapture = async () => {
//       localMediaStream.current = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });
//     };
//     startCapture().then(() => {
//       addNewClient({ ...user, muted: true }, () => {
//         const localElement = audioElements.current[user.id];

//         if (localElement) {
//           localElement.volume = 0;
//           localElement.srcObject = localMediaStream.current;
//         }

//         //socket emit JOIN
//         socketRef.current.emit(ACTIONS.JOIN, { roomId, user });
//       });
//     });

//     return () => {
//       //leaving the room
//       localMediaStream.current.getTracks().forEach((track) => track.stop());
//       socketRef.current.emit(ACTIONS.LEAVE, { roomId });
//     };
//   }, []);

//   useEffect(() => {
//     const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
//       //if already connected then send warning

//       if (peerId in connections.current) {
//         return console.warn(
//           `You are already connected with ${peerId} (${user.name})`
//         );
//       }

//       connections.current[peerId] = new RTCPeerConnection({
//         iceServers: freeice(),
//       });

//       connections.current[peerId].onicecandidate = (e) => {
//         socketRef.current.emit(ACTIONS.RELAY_ICE, {
//           peerId,
//           icecandidate: e.candidate,
//         });
//       };

//       //handle on track on this connection
//       connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
//         addNewClient({ ...remoteUser, muted: true }, () => {
//           if (audioElements.current[remoteUser.id]) {
//             audioElements.current[remoteUser.id].srcObject = remoteStream;
//           } else {
//             let settled = false;
//             const interval = setInterval(() => {
//               if (audioElements.current[remoteUser.id]) {
//                 audioElements.current[remoteUser.id].srcObject = remoteStream;
//                 settled = true;
//               }
//               if (settled) {
//                 clearInterval(interval);
//               }
//             }, 1000);
//           }
//         });
//       };
//       // add local track to remote connections
//       localMediaStream.current.getTracks().forEach((track) => {
//         connections.current[peerId].addTrack(track, localMediaStream.current);
//       });

//       //Create offer
//       if (createOffer) {
//         const offer = await connections.current[peerId].createOffer();

//         await connections.current[peerId].setLocalDescription(offer);

//         //send offer to another client
//         socketRef.current.emit(ACTIONS.RELAY_SDP, {
//           peerId,
//           sessionDescription: offer,
//         });
//       }
//     };

//     socketRef.current.on(ACTIONS.ADD_PEER, handleNewPeer);

//     return () => {
//       socketRef.current.off(ACTIONS.ADD_PEER);
//     };
//   }, []);

//   //handle ice candidate
//   useEffect(() => {
//     socketRef.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
//       if (icecandidate) {
//         connections.current[peerId].addIceCandidate(icecandidate);
//       }
//     });

//     return () => {
//       socketRef.current.off(ACTIONS.ICE_CANDIDATE);
//     };
//   }, []);

//   //handle sdp
//   useEffect(() => {
//     const handleRemoteSdp = async ({
//       peerId,
//       sessionDescription: remoteSessionDescription,
//     }) => {
//       connections.current[peerId].setRemoteDescription(
//         new RTCSessionDescription(remoteSessionDescription)
//       );

//       //if session description is typeof offer then create an asnwer

//       if (remoteSessionDescription.type === "offer") {
//         const connection = connections.current[peerId];
//         const answer = await connection.createAnswer();

//         connection.setLocalDescription(answer);

//         socketRef.current.emit(ACTIONS.RELAY_SDP, {
//           peerId,
//           sessionDescription: answer,
//         });
//       }
//     };

//     socketRef.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

//     return () => {
//       socketRef.current.off(ACTIONS.SESSION_DESCRIPTION);
//     };
//   }, []);

//   //handle remove peer

//   useEffect(() => {
//     const handleRemovePeer = async ({ peerId, userId }) => {
//       if (connections.current[peerId]) {
//         connections.current[peerId].close();
//       }

//       delete connections.current[peerId];
//       delete audioElements.current[peerId];
//       setClients((list) => list.filter((client) => client.id !== userId));
//     };

//     socketRef.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

//     return () => {
//       socketRef.current.off(ACTIONS.REMOVE_PEER);
//     };
//   }, []);

//   useEffect(() => {
//     clientsRef.current = clients;
//   }, [clients]);

//   //listen for mute/unmute
//   useEffect(() => {
//     socketRef.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
//       setMute(true, userId);
//     });

//     socketRef.current.on(ACTIONS.UN_MUTE, ({ peerId, userId }) => {
//       setMute(false, userId);
//     });

//     const setMute = (mute, userId) => {
//       const clientIdx = clientsRef.current
//         .map((client) => client.id)
//         .indexOf(userId);

//       const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
//       if (clientIdx > -1) {
//         connectedClients[clientIdx].muted = mute;
//         setClients(connectedClients);
//       }
//     };
//   }, []);

//   const provideRef = (instance, userId) => {
//     audioElements.current[userId] = instance;
//   };

//   //handle mute/unmute
//   const handleMute = (isMute, userId) => {
//     let settled = false;
//     let interval = setInterval(() => {
//       if (localMediaStream.current) {
//         localMediaStream.current.getTracks()[0].enabled = !isMute;
//         if (isMute) {
//           socketRef.current.emit(ACTIONS.MUTE, {
//             roomId,
//             userId,
//           });
//         } else {
//           socketRef.current.emit(ACTIONS.UN_MUTE, {
//             roomId,
//             userId,
//           });
//         }
//         settled = true;
//       }
//       if (settled) {
//         clearInterval(interval);
//       }
//     }, 200);
//   };
//   return { clients, provideRef, handleMute };
// };

import freeice from "freeice";
import { useCallback, useEffect, useRef } from "react";
import { ACTIONS } from "../socket/actions";
import { socketInit } from "../socket/index";
import { useStateWithCallback } from "./useStateWithCallback";

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const socket = useRef(null);
  const localMediaStream = useRef(null);
  const clientsRef = useRef(null);

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client.id === newClient.id);

      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [clients, setClients]
  );

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  useEffect(() => {
    const initChat = async () => {
      socket.current = socketInit();
      await captureMedia();
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
      });
      socket.current.on(ACTIONS.MUTE_INFO, ({ userId, isMute }) => {
        handleSetMute(isMute, userId);
      });

      socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
      socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
      socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
      socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
      socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
        handleSetMute(true, userId);
      });
      socket.current.on(ACTIONS.UNMUTE, ({ peerId, userId }) => {
        handleSetMute(false, userId);
      });
      socket.current.emit(ACTIONS.JOIN, {
        roomId,
        user,
      });

      async function captureMedia() {
        // Start capturing local audio stream.
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }
      async function handleNewPeer({ peerId, createOffer, user: remoteUser }) {
        if (peerId in connections.current) {
          return console.warn(
            `You are already connected with ${peerId} (${user.name})`
          );
        }

        // Store it to connections
        connections.current[peerId] = new RTCPeerConnection({
          iceServers: freeice(),
        });

        // Handle new ice candidate on this peer connection
        connections.current[peerId].onicecandidate = (event) => {
          socket.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate,
          });
        };

        // Handle on track event on this connection
        connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
          addNewClient({ ...remoteUser, muted: true }, () => {
            // get current users mute info
            const currentUser = clientsRef.current.find(
              (client) => client.id === user.id
            );
            if (currentUser) {
              socket.current.emit(ACTIONS.MUTE_INFO, {
                userId: user.id,
                roomId,
                isMute: currentUser.muted,
              });
            }
            if (audioElements.current[remoteUser.id]) {
              audioElements.current[remoteUser.id].srcObject = remoteStream;
            } else {
              let settled = false;
              const interval = setInterval(() => {
                if (audioElements.current[remoteUser.id]) {
                  audioElements.current[remoteUser.id].srcObject = remoteStream;
                  settled = true;
                }

                if (settled) {
                  clearInterval(interval);
                }
              }, 300);
            }
          });
        };

        // Add connection to peer connections track
        localMediaStream.current.getTracks().forEach((track) => {
          connections.current[peerId].addTrack(track, localMediaStream.current);
        });

        // Create an offer if required
        if (createOffer) {
          const offer = await connections.current[peerId].createOffer();

          // Set as local description
          await connections.current[peerId].setLocalDescription(offer);

          // send offer to the server
          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: offer,
          });
        }
      }
      async function handleRemovePeer({ peerId, userId }) {
        // Correction: peerID to peerId
        if (connections.current[peerId]) {
          connections.current[peerId].close();
        }

        delete connections.current[peerId];
        delete audioElements.current[peerId];
        setClients((list) => list.filter((c) => c.id !== userId));
      }
      async function handleIceCandidate({ peerId, icecandidate }) {
        if (icecandidate) {
          connections.current[peerId].addIceCandidate(icecandidate);
        }
      }
      async function setRemoteMedia({
        peerId,
        sessionDescription: remoteSessionDescription,
      }) {
        connections.current[peerId].setRemoteDescription(
          new RTCSessionDescription(remoteSessionDescription)
        );

        // If session descrition is offer then create an answer
        if (remoteSessionDescription.type === "offer") {
          const connection = connections.current[peerId];

          const answer = await connection.createAnswer();
          connection.setLocalDescription(answer);

          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: answer,
          });
        }
      }
      async function handleSetMute(mute, userId) {
        const clientIdx = clientsRef.current
          .map((client) => client.id)
          .indexOf(userId);
        const allConnectedClients = JSON.parse(
          JSON.stringify(clientsRef.current)
        );
        if (clientIdx > -1) {
          allConnectedClients[clientIdx].muted = mute;
          setClients(allConnectedClients);
        }
      }
    };

    initChat();
    return () => {
      localMediaStream.current.getTracks().forEach((track) => track.stop());
      socket.current.emit(ACTIONS.LEAVE, { roomId });
      for (let peerId in connections.current) {
        connections.current[peerId].close();
        delete connections.current[peerId];
        delete audioElements.current[peerId];
      }
      socket.current.off(ACTIONS.ADD_PEER);
      socket.current.off(ACTIONS.REMOVE_PEER);
      socket.current.off(ACTIONS.ICE_CANDIDATE);
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
      socket.current.off(ACTIONS.MUTE);
      socket.current.off(ACTIONS.UNMUTE);
    };
  }, []);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const handleMute = (isMute, userId) => {
    let settled = false;

    if (userId === user.id) {
      let interval = setInterval(() => {
        if (localMediaStream.current) {
          localMediaStream.current.getTracks()[0].enabled = !isMute;
          if (isMute) {
            socket.current.emit(ACTIONS.MUTE, {
              roomId,
              userId: user.id,
            });
          } else {
            socket.current.emit(ACTIONS.UNMUTE, {
              roomId,
              userId: user.id,
            });
          }
          settled = true;
        }
        if (settled) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

  return {
    clients,
    provideRef,
    handleMute,
  };
};
