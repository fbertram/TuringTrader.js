//==============================================================================
// Name:        simulator/tradingCalendarUS
// Project:     TuringTrader.js
// Description: Trading calendar for US stock exchanges.
// History:     FUB, 2021iv30, created
//==============================================================================

// NOTE: this is a rather disappointing solution. however, 
// it is good enough to keep us going for the next 2 years
// see here: https://www.nyse.com/markets/hours-calendars

// additional info:
// markets close early (1:00 pm Eastern) on
// July 3rd, if July 4th is a weekday
// Friday after Thanksgiving
// 12/24, if 12/25 is a weekday

import { DateTime, Duration } from "luxon"

// New York Stock Exchange closes at 4pm
const _hour = 16
const _minute = 0
const _time = `${_hour}:${_minute}`
const _zone = "America/New_York"
const _format = "M/d/yyyy H:m z"

const _holidayStrings = [
    //--- 1990
    "1/1/1990",
    "2/19/1990",
    "4/13/1990",
    "5/28/1990",
    "7/4/1990",
    "9/3/1990",
    "11/22/1990",
    "12/25/1990",
    //--- 1991
    "1/1/1991",
    "2/18/1991",
    "3/29/1991",
    "5/27/1991",
    "7/4/1991",
    "9/2/1991",
    "11/28/1991",
    "12/25/1991",
    //--- 1992
    "1/1/1992",
    "2/17/1992",
    "4/17/1992",
    "5/25/1992",
    "7/3/1992",
    "9/7/1992",
    "11/26/1992",
    "12/25/1992",
    //--- 1993
    "1/1/1993",
    "2/15/1993",
    "4/9/1993",
    "5/31/1993",
    "7/5/1993",
    "9/6/1993",
    "11/25/1993",
    "12/24/1993",
    //---
    "2/21/1994",
    "4/1/1994",
    "4/27/1994",
    "5/30/1994",
    "7/4/1994",
    "9/5/1994",
    "11/24/1994",
    "12/26/1994",
    //---
    "1/2/1995",
    "2/20/1995",
    "4/14/1995",
    "5/29/1995",
    "7/4/1995",
    "9/4/1995",
    "11/23/1995",
    "12/25/1995",
    //---
    "1/1/1996",
    "2/19/1996",
    "4/5/1996",
    "5/27/1996",
    "7/4/1996",
    "9/2/1996",
    "11/28/1996",
    "12/25/1996",
    //---
    "1/1/1997",
    "2/17/1997",
    "3/28/1997",
    "5/26/1997",
    "7/4/1997",
    "9/1/1997",
    "11/27/1997",
    "12/25/1997",
    //---
    "1/1/1998",
    "1/19/1998",
    "2/16/1998",
    "4/10/1998",
    "5/25/1998",
    "7/3/1998",
    "9/7/1998",
    "11/26/1998",
    "12/25/1998",
    //---
    "1/1/1999",
    "1/18/1999",
    "2/15/1999",
    "4/2/1999",
    "5/31/1999",
    "7/5/1999",
    "9/6/1999",
    "11/25/1999",
    "12/24/1999",
    //---
    "1/17/2000",
    "2/21/2000",
    "4/21/2000",
    "5/29/2000",
    "7/4/2000",
    "9/4/2000",
    "11/23/2000",
    "12/25/2000",
    //---
    "1/1/2001",
    "1/15/2001",
    "2/19/2001",
    "4/13/2001",
    "5/28/2001",
    "7/4/2001",
    "9/3/2001",
    "9/11/2001",
    "9/12/2001",
    "9/13/2001",
    "9/14/2001",
    "11/22/2001",
    "12/25/2001",
    //---
    "1/1/2002",
    "1/21/2002",
    "2/18/2002",
    "3/29/2002",
    "5/27/2002",
    "7/4/2002",
    "9/2/2002",
    "11/28/2002",
    "12/25/2002",
    //---
    "1/1/2003",
    "1/20/2003",
    "2/17/2003",
    "4/18/2003",
    "5/26/2003",
    "7/4/2003",
    "9/1/2003",
    "11/27/2003",
    "12/25/2003",
    //---
    "1/1/2004",
    "1/19/2004",
    "2/16/2004",
    "4/9/2004",
    "5/31/2004",
    "6/11/2004",
    "7/5/2004",
    "9/6/2004",
    "11/25/2004",
    "12/24/2004",
    //---
    "1/17/2005",
    "2/21/2005",
    "3/25/2005",
    "5/30/2005",
    "7/4/2005",
    "9/5/2005",
    "11/24/2005",
    "12/26/2005",
    //---
    "1/2/2006",
    "1/16/2006",
    "2/20/2006",
    "4/14/2006",
    "5/29/2006",
    "7/4/2006",
    "9/4/2006",
    "11/23/2006",
    "12/25/2006",
    //---
    "1/1/2007",
    "1/2/2007",
    "1/15/2007",
    "2/19/2007",
    "4/6/2007",
    "5/28/2007",
    "7/4/2007",
    "9/3/2007",
    "11/22/2007",
    "12/25/2007",
    //---
    "1/1/2008",
    "1/21/2008",
    "2/18/2008",
    "3/21/2008",
    "5/26/2008",
    "7/4/2008",
    "9/1/2008",
    "11/27/2008",
    "12/25/2008",
    //---
    "1/1/2009",
    "1/19/2009",
    "2/16/2009",
    "4/10/2009",
    "5/25/2009",
    "7/3/2009",
    "9/7/2009",
    "11/26/2009",
    "12/25/2009",
    //---
    "1/1/2010",
    "1/18/2010",
    "2/15/2010",
    "4/2/2010",
    "5/31/2010",
    "7/5/2010",
    "9/6/2010",
    "11/25/2010",
    "12/24/2010",
    //---
    "1/17/2011",
    "2/21/2011",
    "4/22/2011",
    "5/30/2011",
    "7/4/2011",
    "9/5/2011",
    "11/24/2011",
    "12/26/2011",
    //---
    "1/2/2012",
    "1/16/2012",
    "2/20/2012",
    "4/6/2012",
    "5/28/2012",
    "7/4/2012",
    "9/3/2012",
    "10/29/2012",
    "10/30/2012",
    "11/22/2012",
    "12/25/2012",
    //---
    "1/1/2013",
    "1/21/2013",
    "2/18/2013",
    "3/29/2013",
    "5/27/2013",
    "7/4/2013",
    "9/2/2013",
    "11/28/2013",
    "12/25/2013",
    //---
    "1/1/2014",
    "1/20/2014",
    "2/17/2014",
    "4/18/2014",
    "5/26/2014",
    "7/4/2014",
    "9/1/2014",
    "11/27/2014",
    "12/25/2014",
    //---
    "1/1/2015",
    "1/19/2015",
    "2/16/2015",
    "4/3/2015",
    "5/25/2015",
    "7/3/2015",
    "9/7/2015",
    "11/26/2015",
    "12/25/2015",
    //---
    "1/1/2016",
    "1/18/2016",
    "2/15/2016",
    "3/25/2016",
    "5/30/2016",
    "7/4/2016",
    "9/5/2016",
    "11/24/2016",
    "12/26/2016",
    //---
    "1/2/2017",
    "1/16/2017",
    "2/20/2017",
    "4/14/2017",
    "5/29/2017",
    "7/4/2017",
    "9/4/2017",
    "11/23/2017",
    "12/25/2017",
    //---
    "1/1/2018",
    "1/15/2018",
    "2/19/2018",
    "3/30/2018",
    "5/28/2018",
    "7/4/2018",
    "9/3/2018",
    "11/22/2018",
    "12/5/2018",
    "12/25/2018",
    //--- 2019
    "1/1/2019",   // Years Day
    "1/21/2019",  // Martin Luther Kind, Jr. Day
    "2/18/2019",  // Washington's Birthday
    "4/19/2019",  // Good Friday
    "5/27/2019",  // Memorial Day
    "7/4/2019",   // Independence Day
    "9/2/2019",   // Labor Day
    "11/28/2019", // Thanksgiving Day
    "12/25/2019", // Christmas
    //--- 2020
    "1/1/2020",   // Years Day
    "1/20/2020",  // Martin Luther Kind, Jr. Day
    "2/17/2020",  // Washington's Birthday
    "4/10/2020",  // Good Friday
    "5/25/2020",  // Memorial Day
    "7/3/2020",   // Independence Day
    "9/7/2020",   // Labor Day
    "11/26/2020", // Thanksgiving Day
    "12/25/2020", // Christmas
    //--- 2021
    "1/1/2021",   // Years Day
    "1/18/2021",  // Martin Luther Kind, Jr. Day
    "2/15/2021",  // Washington's Birthday
    "4/2/2021",   // Good Friday
    "5/31/2021",  // Memorial Day
    "7/5/2021",   // Independence Day
    "9/6/2021",   // Labor Day
    "11/25/2021", // Thanksgiving Day
    "12/24/2021", // Christmas
]

const _holidays = _holidayStrings
    .map(s => DateTime.fromFormat(`${s} ${_time} ${_zone}`, _format).toJSDate())

const _oneDay = Duration.fromObject({days: 1})
    
export const createTradingCalendarUS = () => {
    const data = {}

    return {
        get startDate() {
            return data.startDate
        },
        set startDate(value) {
            data.startDate = value
        },

        get endDate() {
            return data.endDate
        },
        set endDate(value) {
            data.endDate = value
        },

        get tradingDays() {

            const isExchangeOpen = (dateTime) => {
                const day = dateTime.setZone(_zone).weekday
                const epoch = dateTime.toJSDate().getTime()
                const isHoliday = _holidays.some(d => d.getTime() === epoch)

                return day !== 6 && day !== 7 && !isHoliday
            }

            const previousClosingTime = (dateTime) => {
                const timeAtExchange = dateTime.setZone(_zone)
                const timeOfClose = timeAtExchange
                    .set({
                        hour: _hour,
                        minute: _minute,
                        second: 0,
                        millisecond: 0
                    })

                let previousClose = timeOfClose
                while (previousClose > dateTime || !isExchangeOpen(previousClose))
                    previousClose = previousClose.minus(_oneDay)

                return previousClose
            }

            // startDate is the timestamp of the first bar's close
            const earliestDate = DateTime.fromFormat(`1/2/1990 ${_time} ${_zone}`, _format)
            const startProperty = data.hasOwnProperty('startDate') ?
                DateTime.fromJSDate(data.startDate) :
                earliestDate
            const startDate = previousClosingTime(
                startProperty > earliestDate ?
                    startProperty :
                    earliestDate)
 
            // endDate is the timestamp of the last bar's close
            const latestDate = DateTime.now().setZone(_zone)
            const endProperty = data.hasOwnProperty('endDate') ?
                DateTime.fromJSDate(data.endDate) :
                latestDate
            const endDate = previousClosingTime(
                endProperty < latestDate ? 
                    endProperty : 
                    latestDate)

            const tradingDays = []
            let date = startDate

            while (date <= endDate) {
                if (isExchangeOpen(date))
                    tradingDays.push(date.toJSDate())

                date = date.plus(_oneDay)
                //date.setDate(date.getDate() + 1)
            }

            return tradingDays
        }
    }
}

//==============================================================================
// end of file
