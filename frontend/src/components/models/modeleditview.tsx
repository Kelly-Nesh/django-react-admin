import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cl, TokenContext } from "../../App";
import { modelGet } from "../../services/crud/model_crud";
import parse from "html-react-parser";

const ModelEdit = () => {
  const { app, model, id } = useParams();
  const { access_token: token } = useContext(TokenContext);
  const [single_model, setSingleModel] = useState("");

  useEffect(() => {
    const model_res = modelGet(token, app, model, id);
    model_res?.then((r) => setSingleModel(r));
  }, [id, model]);
  // cl(single_model);
  return <>{parse(single_model)}</>;
};
export default ModelEdit;
