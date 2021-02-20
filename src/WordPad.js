import { Cancel } from "@material-ui/icons";

import "./WordPad.css";

export const WordPad = ({ name, id, onClick, onRemove, points }) => {
  return (
    <div className="word-pad">
      <div
        onClick={onClick}
        onContextMenu={onRemove}
        className="word-pad__content"
      >
        {name}
      </div>
      <Cancel className="word-pad__remove" onClick={onRemove} />
    </div>
  );
};
