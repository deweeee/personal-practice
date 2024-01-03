const addZero = (item) => {
  item = item < 10 ? '0' + item : item
  return item
}

// 旧式方法,用js计算
const getTimeByM = (time, monthDiff = 0, t) => {
  let newTime = new Date()
  if (time) {
    newTime = new Date(time)
  }
  let Year = newTime.getFullYear()
  let M = newTime.getMonth() + 1 + monthDiff
  let Day = addZero(newTime.getDate())
  if (M > 12) {
    Year += Math.floor(M / 12)
    M = M % 12
  }
  if (M <= 0) {
    M = Math.abs(M)
    let t = Math.ceil(M / 12) || 1
    Year -= t
    M = t * 12 - M || 12
  }
  let Month = addZero(M)
  return t ? `${Year}-${Month}` : `${Year}-${Month}-${Day}`
}

//使用Date对象set方法设置
const getTimeByMonth = (time, monthDiff = 0, t) => {
  let newTime = new Date()
  if (time) {
    newTime = new Date(time)
  }
  newTime.setMonth(newTime.getMonth() + monthDiff)
  let Year = newTime.getFullYear()
  let Month = addZero(newTime.getMonth() + 1)
  let Day = addZero(newTime.getDate())
  return t ? `${Year}-${Month}` : `${Year}-${Month}-${Day}`
}

export default {
  getTimeByM,
  getTimeByMonth
}
