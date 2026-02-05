import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function ProjectsCalendar({ projects = [], onSelectProject }) {
  const markedDates = useMemo(() => {
    const marks = {};

    projects.forEach(p => {
      if (!p.startDate) return;

      const start = p.startDate;
      const end = p.noDeadline ? p.startDate : p.deadline;

      // mark date range
      let d = new Date(start);
      const last = new Date(end);

      while (d <= last) {
        const key = d.toISOString().split('T')[0];

        marks[key] = {
          ...(marks[key] || {}),
          marked: true,
          dots: [
            ...(marks[key]?.dots || []),
            {
              key: String(p.id),
              color: '#1d4ed8',
            },
          ],
        };

        d.setDate(d.getDate() + 1);
      }
    });

    return marks;
  }, [projects]);

  return (
    <View>
      <Calendar
        markingType="multi-dot"
        markedDates={markedDates}
        onDayPress={day => {
          const list = projects.filter(
            p =>
              day.dateString >= p.startDate &&
              day.dateString <= (p.deadline || p.startDate),
          );

          if (list.length && onSelectProject) {
            onSelectProject(list[0]);
          }
        }}
      />
    </View>
  );
}
