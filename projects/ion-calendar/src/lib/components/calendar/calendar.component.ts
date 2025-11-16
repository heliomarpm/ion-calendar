import {Component, Input, OnInit, Output, EventEmitter, forwardRef, Provider} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {Settings as luxonSettings, DateTime} from "luxon";
import {DateTimeHelper} from "../../helpers";

import {IonCalendarService} from "../../ion-calendar.service";
import {
	ICalendarComponentMonthChange,
	ICalendarComponentOptions,
	ICalendarComponentWeekChange,
	ICalendarDay,
	ICalendarModalOptions,
	ICalendarMonth,
} from "../../models";
import defaultValues, {
	CalendarComponentOnChangeType,
	CalendarComponentPayloadRangeType,
	CalendarComponentPayloadType,
	CalendarComponentType,
	ColorType,
	pickModes,
} from "../../types";

export const ION_CAL_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => CalendarComponent),
	multi: true,
};
@Component({
	selector: "ion-calendar",
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.scss"],
	providers: [ION_CAL_VALUE_ACCESSOR],
})
export class CalendarComponent implements ControlValueAccessor, OnInit {
	def!: ICalendarModalOptions;
	monthOpt!: ICalendarMonth;
	calendarMonthValue: Array<ICalendarDay | null> = [null, null];
	view: "year" | "month" | "days" = "days";
	yearStep: number = 0;

	public _monthsTitle = DateTimeHelper.monthsShortTitle();

	private _showNavigateButtons = true;
    get showNavigateButtons(): boolean {
		return this._showNavigateButtons;
	}
	set showNavigateButtons(value: boolean) {
		this._showNavigateButtons = value;
	}

	private _showMonthPicker = true;
	get showMonthPicker(): boolean {
		return this._showMonthPicker;
	}
	set showMonthPicker(value: boolean) {
		this._showMonthPicker = value;
	}

	private _options: ICalendarComponentOptions = {};
	get options(): ICalendarComponentOptions {
		return this._options;
	}

	@Input()
	set options(value: ICalendarComponentOptions) {
		this._options = value;
		this.initOpt();
		if (this.monthOpt?.original) {
			this.createWeekOrMonth(this.monthOpt.original.time);
		}
	}

	@Input() color: ColorType | undefined = undefined;
	@Input() format: string = defaultValues.DATE_FORMAT;
	@Input() type: CalendarComponentType = "string";
	@Input() readonly = false;

	@Output() onChange: EventEmitter<CalendarComponentOnChangeType> = new EventEmitter();
	@Output() onMonthChange: EventEmitter<ICalendarComponentMonthChange> = new EventEmitter();
	@Output() onWeekChange: EventEmitter<ICalendarComponentWeekChange> = new EventEmitter();
	@Output() onSelect: EventEmitter<ICalendarDay> = new EventEmitter();
	@Output() onSelectStart: EventEmitter<ICalendarDay> = new EventEmitter();
	@Output() onSelectEnd: EventEmitter<ICalendarDay> = new EventEmitter();

	constructor(public calSvc: IonCalendarService) {
		luxonSettings.defaultLocale = "en";
	}

	ngOnInit(): void {
		this.initOpt();
		this.createWeekOrMonth(new Date().getTime());
	}

	private _selectedDates!: Date | Date[];

	get selectedDates() {
		if (this._selectedDates) {
			return this._selectedDates;
		}

		const dates: Array<Date> = [];
		for (const el of this.calendarMonthValue) {
			if (el?.time) {
				dates.push(new Date(el.time));
			}
		}
		return dates;
	}
	private set selectedDates(value: Date | Date[]) {
		this._selectedDates = value;
	}

	protected switchView(): void {
		const switchNext = this.options.showYearPicker ?? true ? "year" : "month";
		const switchPrev = this.view === "year" ? "month" : "days";
		this.view = this.view === "days" ? switchNext : switchPrev;
	}

	switchIcon(): string {
		const secondIcon = (this.options.showYearPicker ?? true) && this.view === "year" ? "caret-down" : "caret-up";
		return this.view === "days" ? "caret-down" : secondIcon;
	}

	protected prev(): void {
		if (this.view === "days") {
			if (this.def.displayMode === "week") {
				this.backWeek();
			} else {
				this.backMonth();
			}
		} else if (this.view === "month") {
			this.prevYear();
		} else {
			this.yearStep -= 1;
		}
	}

	protected next(): void {
		if (this.view === "days") {
			if (this.def.displayMode === "week") {
				this.nextWeek();
			} else {
				this.nextMonth();
			}
		} else if (this.view === "month") {
			this.nextYear();
		} else {
			this.yearStep += 1;
		}
	}

	private prevYear(): void {
		const backTime = DateTime.fromMillis(this.monthOpt.original.time).minus({year: 1}).valueOf();
		this.createWeekOrMonth(backTime);
	}

	private nextYear(): void {
		const nextTime = DateTime.fromMillis(this.monthOpt.original.time).plus({year: 1}).valueOf();
		this.createWeekOrMonth(nextTime);
	}

	private nextMonth() {
		const nextTime = DateTime.fromMillis(this.monthOpt.original.time).plus({months: 1}).valueOf();
		this.onMonthChange.emit({
			oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
			newMonth: this.calSvc.multiFormat(nextTime),
		});
		this.monthOpt = this.createMonth(nextTime);
	}

	private nextWeek() {
		const nextTime = DateTime.fromMillis(this.monthOpt.original.time).plus({weeks: this.def.weeks}).valueOf();
		const newWeek = this.calSvc.multiFormat(nextTime);
		const oldWeek = this.calSvc.multiFormat(this.monthOpt.original.time);

		this.monthOpt = this.createWeek(nextTime);
		this.onWeekChange.emit({oldWeek: oldWeek, newWeek: this.calSvc.multiFormat(this.monthOpt.original.time)});

		if (oldWeek.month != newWeek.month) {
			this.onMonthChange.emit({oldMonth: oldWeek, newMonth: this.calSvc.multiFormat(this.monthOpt.original.time)});
		}
	}

	canNext(): boolean {
		if (!this.def.to || this.view !== "days") return true;

		const toDate = DateTimeHelper.parse(this.def.to);
		return this.monthOpt.original.lastDayOfMonth < toDate.toMillis();
	}

	private backMonth(): void {
		const backTime = DateTime.fromMillis(this.monthOpt.original.time).minus({months: 1}).valueOf();
		this.onMonthChange.emit({
			oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
			newMonth: this.calSvc.multiFormat(backTime),
		});
		this.monthOpt = this.createMonth(backTime);
	}

	private backWeek(): void {
		const backTime = DateTime.fromMillis(this.monthOpt.original.time).minus({weeks: this.def.weeks}).valueOf();
		const newWeek = this.calSvc.multiFormat(backTime);
		const oldWeek = this.calSvc.multiFormat(this.monthOpt.original.time);

		this.onWeekChange.emit({oldWeek: oldWeek, newWeek: newWeek});

		if (oldWeek.month != newWeek.month) {
			this.onMonthChange.emit({oldMonth: oldWeek, newMonth: newWeek});
		}

		this.monthOpt = this.createWeek(backTime);
	}

	canPrev(): boolean {
		if (!this.def.from || this.view !== "days") return true;

		const fromDate = DateTimeHelper.parse(this.def.from);
		return this.monthOpt.original.time > fromDate.valueOf();
	}

	onMonthSelect(month: number): void {
		this.view = "days";

		const newMonth = DateTimeHelper.parse(this.monthOpt.original.time).set({month}).valueOf();
		this.onMonthChange.emit({
			oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
			newMonth: this.calSvc.multiFormat(newMonth),
		});
		this.createWeekOrMonth(newMonth);
	}

	public onYearSelect(year: number): void {
		this.view = "month";

		const newYear = DateTimeHelper.parse(this.monthOpt.original.time).set({year}).valueOf();
		this.onMonthChange.emit({
			oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
			newMonth: this.calSvc.multiFormat(newYear),
		});
		this.monthOpt = this.createMonth(newYear);
	}

	protected onChanged($event: ICalendarDay[]): void {
		const eCD: ICalendarDay[] = $event;

		this.yearStep = 0;

		const emitOnChange = (date: CalendarComponentOnChangeType) => {
			this._onChanged(date);
			this.onChange.emit(date);
		};

		switch (this.def.pickMode) {
			case pickModes.single:
				const dTime = eCD[0].time;
				const date = this._handleType(dTime);

				this.selectedDates = DateTimeHelper.parse(dTime).toJSDate();
				emitOnChange(date);
				break;

			case pickModes.range:
				if (eCD[0] && eCD[1]) {
					const timeFrom = eCD[0].time;
					const timeTo = eCD[1].time;

					const rangeDate: CalendarComponentPayloadRangeType = {
						from: this._handleType(timeFrom),
						to: this._handleType(timeTo),
					};

					this.selectedDates = Array<Date>(DateTimeHelper.parse(timeFrom).toJSDate(), DateTimeHelper.parse(timeTo).toJSDate());

					emitOnChange(rangeDate);
				}
				break;

			case pickModes.multi:
				const emitChangeForMulti = (days: ICalendarDay[]): Array<Date> => {
					const dates: Array<Date> = [];

					const payloads: Array<CalendarComponentPayloadType> = [];
					for (const day of days) {
						if (day?.time) {
							const payload = this._handleType(day.time);
							payloads.push(payload);
							dates.push(DateTimeHelper.parse(day.time).toJSDate());
						}
					}

					emitOnChange(payloads);
					return dates;
				};
				this.selectedDates = emitChangeForMulti(eCD);
				break;

			default:
		}
	}

	private _onChanged: Function = () => {};
	private _onTouched: Function = () => {};

	private _payloadToTimeNumber(value: CalendarComponentPayloadType): number {
		const date = typeof value === "string"
      ? DateTime.fromFormat(value, this.format.replace(/Y/g, "y"))
      : DateTimeHelper.parse(value);

		return date.valueOf();
	}

	monthFormat(date: number): string {
		if (!this.def.monthFormat) return "";
		return DateTimeHelper.parse(date).toFormat(this.def.monthFormat.replace(/Y/g, "y"), {locale: this._options.locale?.locale});
	}

	private initOpt(): void {
        this.showNavigateButtons = this._options.showNavigateButtons ?? true;
		this.showMonthPicker = this._options.showMonthPicker ?? true;

		if (this.view !== "days" && !this.showMonthPicker) {
			this.view = "days";
		}

		if (this.color && this.color !== this.options.color) {
			this.options.color = this.color;
		}

		this.def = this.calSvc.safeOpt(this._options);
		this._options = {
			...this._options,
			...this.def,
		};

		const locale = this._options.locale?.locale || "en";
		luxonSettings.defaultLocale = locale;

		this._monthsTitle = this._options.monthsTitle ?? DateTimeHelper.monthsShortTitle(locale);
	}

	private createWeekOrMonth(time: number) {
		if (this.def.displayMode === "week") {
			this.monthOpt = this.createWeek(time);
		} else {
			this.monthOpt = this.createMonth(time);
		}
	}

	private createWeek(date: number): ICalendarMonth {
		const period = this.calSvc.createWeeksByPeriod(date, this.def);
		return period[0];
	}
	private createMonth(date: number): ICalendarMonth {
		const period = this.calSvc.createMonthsByPeriod(date, 1, this.def);
		return period[0];
	}

	private _createCalendarDay(value: CalendarComponentPayloadType): ICalendarDay {
		return this.calSvc.createCalendarDay(this._payloadToTimeNumber(value), this.def);
	}

	private _handleType(value: number): CalendarComponentPayloadType {
		const date = DateTimeHelper.parse(value);
		switch (this.type) {
			case "time":
				return date.valueOf();
			case "js-date":
				return date.toJSDate();
			case "object":
				return date.toObject();
			case "luxon":
				return date;
			case "string":
			default:
				return date.toFormat(this.format.replace(/Y/g, "y"));
		}
	}

	writeValue(obj: CalendarComponentOnChangeType): void {
		this._writeValue(obj);
		if (obj) {
			if (this.calendarMonthValue[0]) {
				if (!Number.isNaN(this.calendarMonthValue[0].time)) {
          this.createWeekOrMonth(this.calendarMonthValue[0].time);
        }
			} else {
				this.createWeekOrMonth(new Date().getTime());
			}
		}
	}

	registerOnChange(fn: Function): void {
		this._onChanged = fn;
	}

	registerOnTouched(fn: Function): void {
		this._onTouched = fn;
	}

	private _writeValue(value: CalendarComponentOnChangeType): void {
		if (!value) {
			this.calendarMonthValue = [null, null];
			return;
		}

		this.onChange.emit(value);

		switch (this.def.pickMode) {
			case "single":
				this.calendarMonthValue[0] = this._createCalendarDay(value as CalendarComponentPayloadType);
				break;

			case "range":
				const {from, to} = value as CalendarComponentPayloadRangeType;
				this.calendarMonthValue[0] = from ? this._createCalendarDay(from) : null;
				this.calendarMonthValue[1] = to ? this._createCalendarDay(to) : null;
				break;

			case "multi":
				if (Array.isArray(value)) {
					this.calendarMonthValue = value.map((e) => {
						return this._createCalendarDay(e);
					});
				} else {
					this.calendarMonthValue = [null, null];
				}
				break;

			default:
		}
	}
}
