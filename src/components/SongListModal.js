import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

function SongListModal(props) {
  return (
    <Modal isOpen={props.open} style={customStyles}>
      <button onClick={props.close()}>Close song list</button>
      <ol>
        {props.songList.map((media) => {
          return media.tracks.map((song) => {
            return <li>{song.recording.title}</li>;
          });
        })}
      </ol>
    </Modal>
  );
}

export default SongListModal;
