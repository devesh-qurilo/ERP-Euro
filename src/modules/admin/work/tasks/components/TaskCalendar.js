import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function TaskCalendar({ data = [], onPressTask }) {
  const [current, setCurrent] = useState(() => {
    const t = new Date();
    return { year: t.getFullYear(), month: t.getMonth() };
  });

  const goPrev = () => {
    setCurrent(prev => {
      let m = prev.month - 1;
      let y = prev.year;
      if (m < 0) {
        m = 11;
        y--;
      }
      return { year: y, month: m };
    });
  };

  const goNext = () => {
    setCurrent(prev => {
      let m = prev.month + 1;
      let y = prev.year;
      if (m > 11) {
        m = 0;
        y++;
      }
      return { year: y, month: m };
    });
  };

  const monthSlots = useMemo(() => {
    const { month, year } = current;

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const startDay = monthStart.getDay(); // 0 = Sunday
    const daysInMonth = monthEnd.getDate();

    let slots = [];

    // PREVIOUS MONTH EMPTY CELLS
    for (let i = 0; i < startDay; i++) {
      slots.push({ type: 'empty' });
    }

    // CURRENT MONTH DAYS WITH TASKS
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const dateStr = d.toISOString().split('T')[0];

      const tasks = data.filter(t => (t.startDate || '').startsWith(dateStr));

      slots.push({
        type: 'day',
        dayNum: i,
        fullDate: d,
        tasks,
      });
    }

    // FILL TO 42 CELLS
    while (slots.length < 42) {
      slots.push({ type: 'empty' });
    }

    return slots;
  }, [current, data]);

  return (
    <View style={{ backgroundColor: '#fff', padding: 10 }}>
      {/* HEADER WITH NAVIGATION */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <TouchableOpacity onPress={goPrev}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 22, fontWeight: '700' }}>
          {new Date(current.year, current.month).toLocaleDateString(undefined, {
            month: 'long',
            year: 'numeric',
          })}
        </Text>

        <TouchableOpacity onPress={goNext}>
          <Text style={{ fontSize: 22 }}>→</Text>
        </TouchableOpacity>
      </View>

      {/* DAYS HEADER */}
      <View style={{ flexDirection: 'row' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <Text
            key={d}
            style={{
              flex: 1,
              textAlign: 'center',
              fontWeight: '700',
              marginBottom: 4,
              color: '#374151',
            }}
          >
            {d}
          </Text>
        ))}
      </View>

      {/* GRID */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {monthSlots.map((cell, i) => (
          <View
            key={i}
            style={{
              width: '14.28%',
              height: 95,
              borderWidth: 0.5,
              borderColor: '#EEE',
              padding: 4,
            }}
          >
            {cell.type === 'day' && (
              <>
                <Text
                  style={{
                    fontWeight: '700',
                    color: '#111',
                    marginBottom: 3,
                  }}
                >
                  {cell.dayNum}
                </Text>

                {cell.tasks.slice(0, 3).map(t => (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => onPressTask && onPressTask(t)}
                    style={{
                      backgroundColor: '#2563EB22',
                      paddingVertical: 2,
                      paddingHorizontal: 3,
                      borderRadius: 4,
                      marginTop: 2,
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '600' }}>
                      {t.title}
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* If more tasks exist */}
                {cell.tasks.length > 3 && (
                  <Text style={{ fontSize: 10, marginTop: 2, color: '#444' }}>
                    +{cell.tasks.length - 3} more
                  </Text>
                )}
              </>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
