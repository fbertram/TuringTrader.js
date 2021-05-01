//==============================================================================
// Name:        simulator/tradingCalendarUS
// Project:     TuringTrader.js
// Description: Trading calendar for US stock exchanges.
// History:     FUB, 2021iv30, created
//==============================================================================

// FIXME: this code creates timestamps in the local timezone.
// it would most likely be desirable to move this all to the
// stock exchange's time zone.

// NOTE: this is a rather disappointing solution. however, 
// it is good enough to keep us going for the next 2 years
// see here: https://www.nyse.com/markets/hours-calendars

// additional info:
// markets close early (1:00 pm Eastern) on
// July 3rd, if July 4th is a weekday
// Friday after Thanksgiving
// 12/24, if 12/25 is a weekday

const _holidays = [
    //--- 1990
    new Date("1/1/1990"),
    new Date("2/19/1990"),
    new Date("4/13/1990"),
    new Date("5/28/1990"),
    new Date("7/4/1990"),
    new Date("9/3/1990"),
    new Date("11/22/1990"),
    new Date("12/25/1990"),
    //--- 1991
    new Date("1/1/1991"),
    new Date("2/18/1991"),
    new Date("3/29/1991"),
    new Date("5/27/1991"),
    new Date("7/4/1991"),
    new Date("9/2/1991"),
    new Date("11/28/1991"),
    new Date("12/25/1991"),
    //--- 1992
    new Date("1/1/1992"),
    new Date("2/17/1992"),
    new Date("4/17/1992"),
    new Date("5/25/1992"),
    new Date("7/3/1992"),
    new Date("9/7/1992"),
    new Date("11/26/1992"),
    new Date("12/25/1992"),
    //--- 1993
    new Date("1/1/1993"),
    new Date("2/15/1993"),
    new Date("4/9/1993"),
    new Date("5/31/1993"),
    new Date("7/5/1993"),
    new Date("9/6/1993"),
    new Date("11/25/1993"),
    new Date("12/24/1993"),
    //---
    new Date("2/21/1994"),
    new Date("4/1/1994"),
    new Date("4/27/1994"),
    new Date("5/30/1994"),
    new Date("7/4/1994"),
    new Date("9/5/1994"),
    new Date("11/24/1994"),
    new Date("12/26/1994"),
    //---
    new Date("1/2/1995"),
    new Date("2/20/1995"),
    new Date("4/14/1995"),
    new Date("5/29/1995"),
    new Date("7/4/1995"),
    new Date("9/4/1995"),
    new Date("11/23/1995"),
    new Date("12/25/1995"),
    //---
    new Date("1/1/1996"),
    new Date("2/19/1996"),
    new Date("4/5/1996"),
    new Date("5/27/1996"),
    new Date("7/4/1996"),
    new Date("9/2/1996"),
    new Date("11/28/1996"),
    new Date("12/25/1996"),
    //---
    new Date("1/1/1997"),
    new Date("2/17/1997"),
    new Date("3/28/1997"),
    new Date("5/26/1997"),
    new Date("7/4/1997"),
    new Date("9/1/1997"),
    new Date("11/27/1997"),
    new Date("12/25/1997"),
    //---
    new Date("1/1/1998"),
    new Date("1/19/1998"),
    new Date("2/16/1998"),
    new Date("4/10/1998"),
    new Date("5/25/1998"),
    new Date("7/3/1998"),
    new Date("9/7/1998"),
    new Date("11/26/1998"),
    new Date("12/25/1998"),
    //---
    new Date("1/1/1999"),
    new Date("1/18/1999"),
    new Date("2/15/1999"),
    new Date("4/2/1999"),
    new Date("5/31/1999"),
    new Date("7/5/1999"),
    new Date("9/6/1999"),
    new Date("11/25/1999"),
    new Date("12/24/1999"),
    //---
    new Date("1/17/2000"),
    new Date("2/21/2000"),
    new Date("4/21/2000"),
    new Date("5/29/2000"),
    new Date("7/4/2000"),
    new Date("9/4/2000"),
    new Date("11/23/2000"),
    new Date("12/25/2000"),
    //---
    new Date("1/1/2001"),
    new Date("1/15/2001"),
    new Date("2/19/2001"),
    new Date("4/13/2001"),
    new Date("5/28/2001"),
    new Date("7/4/2001"),
    new Date("9/3/2001"),
    new Date("9/11/2001"),
    new Date("9/12/2001"),
    new Date("9/13/2001"),
    new Date("9/14/2001"),
    new Date("11/22/2001"),
    new Date("12/25/2001"),
    //---
    new Date("1/1/2002"),
    new Date("1/21/2002"),
    new Date("2/18/2002"),
    new Date("3/29/2002"),
    new Date("5/27/2002"),
    new Date("7/4/2002"),
    new Date("9/2/2002"),
    new Date("11/28/2002"),
    new Date("12/25/2002"),
    //---
    new Date("1/1/2003"),
    new Date("1/20/2003"),
    new Date("2/17/2003"),
    new Date("4/18/2003"),
    new Date("5/26/2003"),
    new Date("7/4/2003"),
    new Date("9/1/2003"),
    new Date("11/27/2003"),
    new Date("12/25/2003"),
    //---
    new Date("1/1/2004"),
    new Date("1/19/2004"),
    new Date("2/16/2004"),
    new Date("4/9/2004"),
    new Date("5/31/2004"),
    new Date("6/11/2004"),
    new Date("7/5/2004"),
    new Date("9/6/2004"),
    new Date("11/25/2004"),
    new Date("12/24/2004"),
    //---
    new Date("1/17/2005"),
    new Date("2/21/2005"),
    new Date("3/25/2005"),
    new Date("5/30/2005"),
    new Date("7/4/2005"),
    new Date("9/5/2005"),
    new Date("11/24/2005"),
    new Date("12/26/2005"),
    //---
    new Date("1/2/2006"),
    new Date("1/16/2006"),
    new Date("2/20/2006"),
    new Date("4/14/2006"),
    new Date("5/29/2006"),
    new Date("7/4/2006"),
    new Date("9/4/2006"),
    new Date("11/23/2006"),
    new Date("12/25/2006"),
    //---
    new Date("1/1/2007"),
    new Date("1/2/2007"),
    new Date("1/15/2007"),
    new Date("2/19/2007"),
    new Date("4/6/2007"),
    new Date("5/28/2007"),
    new Date("7/4/2007"),
    new Date("9/3/2007"),
    new Date("11/22/2007"),
    new Date("12/25/2007"),
    //---
    new Date("1/1/2008"),
    new Date("1/21/2008"),
    new Date("2/18/2008"),
    new Date("3/21/2008"),
    new Date("5/26/2008"),
    new Date("7/4/2008"),
    new Date("9/1/2008"),
    new Date("11/27/2008"),
    new Date("12/25/2008"),
    //---
    new Date("1/1/2009"),
    new Date("1/19/2009"),
    new Date("2/16/2009"),
    new Date("4/10/2009"),
    new Date("5/25/2009"),
    new Date("7/3/2009"),
    new Date("9/7/2009"),
    new Date("11/26/2009"),
    new Date("12/25/2009"),
    //---
    new Date("1/1/2010"),
    new Date("1/18/2010"),
    new Date("2/15/2010"),
    new Date("4/2/2010"),
    new Date("5/31/2010"),
    new Date("7/5/2010"),
    new Date("9/6/2010"),
    new Date("11/25/2010"),
    new Date("12/24/2010"),
    //---
    new Date("1/17/2011"),
    new Date("2/21/2011"),
    new Date("4/22/2011"),
    new Date("5/30/2011"),
    new Date("7/4/2011"),
    new Date("9/5/2011"),
    new Date("11/24/2011"),
    new Date("12/26/2011"),
    //---
    new Date("1/2/2012"),
    new Date("1/16/2012"),
    new Date("2/20/2012"),
    new Date("4/6/2012"),
    new Date("5/28/2012"),
    new Date("7/4/2012"),
    new Date("9/3/2012"),
    new Date("10/29/2012"),
    new Date("10/30/2012"),
    new Date("11/22/2012"),
    new Date("12/25/2012"),
    //---
    new Date("1/1/2013"),
    new Date("1/21/2013"),
    new Date("2/18/2013"),
    new Date("3/29/2013"),
    new Date("5/27/2013"),
    new Date("7/4/2013"),
    new Date("9/2/2013"),
    new Date("11/28/2013"),
    new Date("12/25/2013"),
    //---
    new Date("1/1/2014"),
    new Date("1/20/2014"),
    new Date("2/17/2014"),
    new Date("4/18/2014"),
    new Date("5/26/2014"),
    new Date("7/4/2014"),
    new Date("9/1/2014"),
    new Date("11/27/2014"),
    new Date("12/25/2014"),
    //---
    new Date("1/1/2015"),
    new Date("1/19/2015"),
    new Date("2/16/2015"),
    new Date("4/3/2015"),
    new Date("5/25/2015"),
    new Date("7/3/2015"),
    new Date("9/7/2015"),
    new Date("11/26/2015"),
    new Date("12/25/2015"),
    //---
    new Date("1/1/2016"),
    new Date("1/18/2016"),
    new Date("2/15/2016"),
    new Date("3/25/2016"),
    new Date("5/30/2016"),
    new Date("7/4/2016"),
    new Date("9/5/2016"),
    new Date("11/24/2016"),
    new Date("12/26/2016"),
    //---
    new Date("1/2/2017"),
    new Date("1/16/2017"),
    new Date("2/20/2017"),
    new Date("4/14/2017"),
    new Date("5/29/2017"),
    new Date("7/4/2017"),
    new Date("9/4/2017"),
    new Date("11/23/2017"),
    new Date("12/25/2017"),
    //---
    new Date("1/1/2018"),
    new Date("1/15/2018"),
    new Date("2/19/2018"),
    new Date("3/30/2018"),
    new Date("5/28/2018"),
    new Date("7/4/2018"),
    new Date("9/3/2018"),
    new Date("11/22/2018"),
    new Date("12/5/2018"),
    new Date("12/25/2018"),
    //--- 2019
    new Date("01/01/2019"), // New Years Day
    new Date("01/21/2019"), // Martin Luther Kind, Jr. Day
    new Date("02/18/2019"), // Washington's Birthday
    new Date("04/19/2019"), // Good Friday
    new Date("05/27/2019"), // Memorial Day
    new Date("07/04/2019"), // Independence Day
    new Date("09/02/2019"), // Labor Day
    new Date("11/28/2019"), // Thanksgiving Day
    new Date("12/25/2019"), // Christmas
    //--- 2020
    new Date("01/01/2020"), // New Years Day
    new Date("01/20/2020"), // Martin Luther Kind, Jr. Day
    new Date("02/17/2020"), // Washington's Birthday
    new Date("04/10/2020"), // Good Friday
    new Date("05/25/2020"), // Memorial Day
    new Date("07/03/2020"), // Independence Day
    new Date("09/07/2020"), // Labor Day
    new Date("11/26/2020"), // Thanksgiving Day
    new Date("12/25/2020"), // Christmas
    //--- 2021
    new Date("01/01/2021"), // New Years Day
    new Date("01/18/2021"), // Martin Luther Kind, Jr. Day
    new Date("02/15/2021"), // Washington's Birthday
    new Date("04/02/2021"), // Good Friday
    new Date("05/31/2021"), // Memorial Day
    new Date("07/05/2021"), // Independence Day
    new Date("09/06/2021"), // Labor Day
    new Date("11/25/2021"), // Thanksgiving Day
    new Date("12/24/2021"), // Christmas
]

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
            const earliestDate = new Date("01/01/1990")
            const latestDate = new Date()
            // FIXME: calling setHours on the previous line yields an epoch??
            latestDate.setHours(0, 0, 0, 0)

            const startDate = data.hasOwnProperty('startDate') ?
                (data.startDate > earliestDate ? data.startDate : earliestDate) :
                earliestDate

            const endDate = data.hasOwnProperty('endDate') ?
                (data.endDate < latestDate ? data.endDate : latestDate) :
                latestDate

            const tradingDays = []
            let date = startDate
            date.setHours(0, 0, 0, 0)

            while (date < endDate) {
                const day = date.getDay()
                const holiday = _holidays.some(d => d.getTime() === date.getTime())

                if (day !== 0 && day !== 6 && !holiday)
                    tradingDays.push(new Date(date))

                date.setDate(date.getDate() + 1)
            }

            return tradingDays
        }
    }
}

//==============================================================================
// end of file
