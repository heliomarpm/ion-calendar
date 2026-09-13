export class ICalendarResult {
	time = 0;
	seconds = 0;
	dateObj: Date = new Date();
	string = "";
	year = 0;
	month = 0;
	day = 0;
}

export class ICalendarComponentWeekChange {
	oldWeek!: ICalendarResult;
	newWeek!: ICalendarResult;
}

export class ICalendarComponentMonthChange {
	oldMonth!: ICalendarResult;
	newMonth!: ICalendarResult;
}
