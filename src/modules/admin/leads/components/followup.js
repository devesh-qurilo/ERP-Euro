export default function getLatestFollowup(followups = []) {
  if (!followups.length) return null;

  return [...followups]
    .map(f => ({
      ...f,
      _dt: new Date(`${f.nextDate}T${f.startTime || '00:00:00'}`),
    }))
    .sort((a, b) => b._dt - a._dt)[0];
}

// export default function getLatestFollowup(followups = []) {
//   if (!followups.length) return null;

//   return [...followups]
//     .map(f => ({
//       ...f,
//       _dt: new Date(`${f.nextDate}`),
//     }))
//     .sort((a, b) => b._dt - a._dt)[0];
// }
