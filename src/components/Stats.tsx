import { useDailyStats, useTodaysCards } from "@/store/deck/selectors";
import React from "react";

const Stats: React.FC = () => {
  const stats = useDailyStats();
  const todaysCards = useTodaysCards();
  return (
    <table className="stats-table w-full my-8 text-sm text-gray-600">
      <tbody>
        <tr>
          <td>Scheduled cards:</td>
          <td>{todaysCards.length}</td>
        </tr>
        <tr>
          <td>Studied today:</td>
          <td>
            {stats.reviewsToday} / {stats.reviewsPerDay}
          </td>
        </tr>
        <tr>
          <td>New cards:</td>
          <td>
            {stats.newCardsToday} / {stats.newCardsPerDay}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Stats;
