import {Component, ChangeDetectorRef, Input, Output, EventEmitter, forwardRef, AfterViewInit, Provider} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ICalendarDay, ICalendarMonth, ICalendarOriginal} from "../../models";
import defaultValues, {ColorType, PickModeType, pickModes} from "../../types";

export const MONTH_VALUE_ACCESSOR: Provider = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => CalendarMonthComponent),
	multi: true,
};

@Component({
	selector: "ion-calendar-month",
	templateUrl: "./calendar-month.component.html",
	styleUrls: ["./calendar-month.component.scss"],
	providers: [MONTH_VALUE_ACCESSOR],
	// host: {
	// 	"[class.component-mode]": "componentMode",
	// },
})
export class CalendarMonthComponent implements ControlValueAccessor, AfterViewInit {
    // @Input() componentMode = false;
	@Input() month!: ICalendarMonth;
	@Input() pickMode: PickModeType = defaultValues.PICK_MODE as PickModeType;
	@Input() id: string | undefined = undefined;
	@Input() readonly = false;
	@Input() color: ColorType | undefined = defaultValues.COLOR as ColorType;
	@Input() colorSubtitle: ColorType | undefined = undefined;
	@Output() private onChange: EventEmitter<ICalendarDay[]> = new EventEmitter();
	@Output() private onSelect: EventEmitter<ICalendarDay> = new EventEmitter();
	@Output() private onSelectStart: EventEmitter<ICalendarDay> = new EventEmitter();
	@Output() private onSelectEnd: EventEmitter<ICalendarDay> = new EventEmitter();

	private _date: Array<ICalendarDay | null> = [null, null];
	private _isInit = false;
	private _onChanged?: Function;
	private _onTouched?: Function;

	readonly DAY_DATE_FORMAT = "MMMM dd, yyyy";

	get isRange(): boolean {
		return this.pickMode === pickModes.range;
	}

	constructor(public ref: ChangeDetectorRef) {
		// console.log("CalendarMonthComponent.constructor");
	}

	ngAfterViewInit(): void {
		this._isInit = true;
	}

	get value() {
		return this._date;
	}

	writeValue(obj: any): void {
		if (Array.isArray(obj)) {
			this._date = obj;
		}
	}

	registerOnChange(fn: any): void {
		this._onChanged = fn;
	}

	registerOnTouched(fn: any): void {
		this._onTouched = fn;
	}

	trackByTime(index: number, item: ICalendarOriginal): number {
		return item ? item.time : index;
	}

	isEndSelection(day: ICalendarDay): boolean {
		if (!day) {
			return false;
		}

		if (this.pickMode !== pickModes.range || !this._isInit || !this._date[1]) {
			return false;
		}

		return this._date[1].time === day.time;
	}

	getDayLabel(day: ICalendarDay) {
		return new Date(day.time);
	}

	isBetween(day: ICalendarDay): boolean {
		if (!day) {
			return false;
		}

		if (this.pickMode !== pickModes.range || !this._isInit) {
			return false;
		}

		if (!this._date[0] || !this._date[1]) {
			return false;
		}

		const start = this._date[0].time;
		const end = this._date[1].time;

		return day.time < end && day.time > start;
	}

	isStartSelection(day: ICalendarDay): boolean {
		if (!day) {
			return false;
		}
		if (this.pickMode !== pickModes.range || !this._isInit || !this._date[0]) {
			return false;
		}

		return this._date[0].time === day.time && !!this._date[1];
	}

	isSelected(time: number): boolean {
		if (Array.isArray(this._date)) {
			if (this.pickMode !== pickModes.multi) {
				if (!!this._date[0]) {
					return time === this._date[0].time;
				}
				if (!!this._date[1]) {
					return time === this._date[1].time;
				}
			} else {
				return this._date.findIndex((e) => e !== null && e.time === time) !== -1;
			}
		}
		return false;
	}

	onSelected(item: ICalendarDay): void {
		if (this.readonly) {
			return;
		}

		item.selected = true;
		this.onSelect.emit(item);

		switch (this.pickMode) {
			case pickModes.range:
				this.handleSelectedRangeMode(item);
				break;
			case pickModes.multi:
				this.handleSelectedMultiMode(item);
				break;
			case pickModes.single:
			default:
				this.handleSelectedSingleMode(item);
				break;
		}
	}

	private handleSelectedSingleMode(item: ICalendarDay): void {
		this._date[0] = item;
		this.onChange.emit(this._date as ICalendarDay[]);
	}

	private handleSelectedRangeMode(item: ICalendarDay): void {
		if (!this._date[0]) {
			this._date[0] = item;
			this.onSelectStart.emit(item);
		} else if (!this._date[1]) {
			if (this._date[0].time < item.time) {
				this._date[1] = item;
				this.onSelectEnd.emit(item);
			} else {
				this._date[1] = this._date[0];
				this.onSelectEnd.emit(this._date[0]);
				this._date[0] = item;
				this.onSelectStart.emit(item);
			}
		} else if (this._date[0].time > item.time) {
			this._date[0] = item;
			this.onSelectStart.emit(item);
		} else if (this._date[1].time < item.time) {
			this._date[1] = item;
			this.onSelectEnd.emit(item);
		} else {
			this._date[0] = item;
			this.onSelectStart.emit(item);
			this._date[1] = null;
		}

		this.onChange.emit(this._date as ICalendarDay[]);
	}

	private handleSelectedMultiMode(item: ICalendarDay): void {
		const index = this._date.findIndex((e) => !!e && e.time === item.time);

		if (index === -1) {
			this._date.push(item);
		} else {
			this._date.splice(index, 1);
		}

		this.onChange.emit(this._date.filter((e) => !!e) as ICalendarDay[]);
	}
}
