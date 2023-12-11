import { useState } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./customcalendar.styles.css";

import { useNavigate } from "react-router-dom";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CustomCalendar() {
  const [value, onChange] = useState<Value>(new Date());
  const navigate = useNavigate();
  const onClickDay = (value, e) => {
    const date = moment(value).format("YYYY-MM-DD");
    console.log("clicked");
    return navigate(`/daynote/${date}`);
  };

  return (
    <div>
      <Calendar
        formatDay={(locale, date) => moment(date).format("DD")}
        showNeighboringMonth={false}
        onChange={onChange}
        onClickDay={onClickDay}
        value={value}
      />
      <div>{moment(value).format("YYYY-MM-DD")} </div>
    </div>
  );
}
