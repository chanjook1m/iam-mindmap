import { HttpResponse, ResponseResolver } from "msw";
import { element, element2 } from "../data/noteGraphData";

// if (!localStorage.getItem("myPersistedData"))
//   localStorage.setItem("myPersistedData", JSON.stringify(element2));
const ds = element2;
export const getGraphDataResolver: ResponseResolver = async ({ params }) => {
  const { noteId } = params;
  // const storedData = localStorage.getItem("myPersistedData");
  // const responseData = storedData
  //   ? JSON.parse(storedData)
  //   : { message: "No data found" };

  return HttpResponse.json({ data: ds[Number(noteId) - 1] });
};

export const updateGraphDataResolver: ResponseResolver = async ({
  request,
  params,
}) => {
  const reqBody = await request.json();
  const { noteId } = params;

  // const storedData = localStorage.getItem("myPersistedData");
  // const responseData = storedData
  //   ? JSON.parse(storedData)
  //   : { message: "No data found" };
  // localStorage.setItem("myPersistedData", JSON.stringify(responseData));
  ds[Number(noteId) - 1] = reqBody;

  return HttpResponse.json({ data: ds });
};
