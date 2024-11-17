import React, { useState } from "react";
import "../styles/calendar.css";

const DateRangePicker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPrevMonthDays = (firstDay) => {
    if (firstDay === 0) return [];

    const prevMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    const daysInPrevMonth = getDaysInMonth(prevMonthDate);
    const days = [];

    for (let i = daysInPrevMonth - firstDay + 1; i <= daysInPrevMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getNextMonthDays = (firstDay, daysInMonth) => {
    const totalSpaces = firstDay + daysInMonth;
    const nextMonthDays = 35 - totalSpaces;

    return Array.from({ length: nextMonthDays }, (_, i) => i + 1);
  };

  const isCurrentMonth = (date) => {
    return (
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  const handleDateClick = (day, isCurrentMonth) => {
    if (!isCurrentMonth) return; // 禁用非當月日期點擊

    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    if (!startDate || clickedDate < startDate) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (clickedDate > startDate) {
      setEndDate(clickedDate);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const changeMonth = (delta) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + delta,
      1
    );
    setCurrentDate(newDate);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isInRange = (day) => {
    if (!startDate || !endDate) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date >= startDate && date <= endDate;
  };

  const isStartOrEnd = (day) => {
    if (!startDate) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return (
      date.getTime() === startDate.getTime() ||
      (endDate && date.getTime() === endDate.getTime())
    );
  };

  const getDayClassName = (day, isCurrentMonthDay = true) => {
    const classNames = ["dayButton"];

    if (!isCurrentMonthDay) {
      classNames.push("dayButtonNonCurrentMonth");
      return classNames.join(" ");
    }

    if (isToday(day)) {
      classNames.push("dayButtonToday");
    }
    if (isStartOrEnd(day)) {
      classNames.push("dayButtonActive");
    }
    if (isInRange(day)) {
      classNames.push("dayButtonInRange");
    }

    return classNames.join(" ");
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // 上個月的日期
    const prevMonthDays = getPrevMonthDays(firstDay);
    prevMonthDays.forEach((day) => {
      days.push(
        <button
          key={`prev-${day}`}
          className={getDayClassName(day, false)}
          onClick={() => handleDateClick(day, false)}
          disabled
        >
          {`${day}日`}
        </button>
      );
    });

    // 當月的日期
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={`current-${day}`}
          className={getDayClassName(day, true)}
          onClick={() => handleDateClick(day, true)}
        >
          {`${day}日`}
        </button>
      );
    }

    // 下個月的日期
    const nextMonthDays = getNextMonthDays(firstDay, daysInMonth);
    nextMonthDays.forEach((day) => {
      days.push(
        <button
          key={`next-${day}`}
          className={getDayClassName(day, false)}
          onClick={() => handleDateClick(day, false)}
          disabled
        >
          {`${day}日`}
        </button>
      );
    });

    return days;
  };

  const getMonthName = () => {
    return currentDate.toLocaleString("default", { month: "long" });
  };

  return (
    <div className="dateRangeContainer">
      <div className="dateRangeHeader">
        <button className="monthSelect" onClick={() => changeMonth(-1)}>
          {"<"}
        </button>
        <div>
          {currentDate.getFullYear()}
          <span> </span>
          {getMonthName()}
        </div>
        <button className="monthSelect" onClick={() => changeMonth(1)}>
          {">"}
        </button>
      </div>

      <div className="calendarGrid">
        {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
          <div key={day} className="weekDayHeader">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

export default DateRangePicker;
