import CustomCalendar from "../components/common/CustomCalendar";

export default function Root() {
  return (
    <main className="main">
      <p>일단 리스트로 보여주고 나중에 구체화</p>
      <ul className="brainwords">
        <li>33% - Frontend</li>
        <ul>
          <li>11% - React</li>
        </ul>
        <li>22% - Learning</li>
        <li>11% - German</li>
      </ul>
      <CustomCalendar />
    </main>
  );
}
