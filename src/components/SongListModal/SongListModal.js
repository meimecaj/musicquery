import React from "react";
import Modal from "react-modal";
import "./song-list-modal.css";

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
      <button className="button" onClick={props.close()}>
          <i className="fa fa-close"></i>
        </button>
      <div className="modal-content-wrapper">
        <ol>
          {props.songList.map((media) => {
            return media.tracks.map((song) => {
              return <li>{song.recording.title}</li>;
            });
          })}
        </ol>
      </div>
    </Modal>
  );
}

export default SongListModal;
