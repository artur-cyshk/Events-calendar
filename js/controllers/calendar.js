app.controller('CalendarCtrl', ['$scope', 'localStorageService', '$location', function($scope, localStorageService, $location){
	var currentDate = new Date(),
		currentYear = currentDate.getFullYear();

	
	setHolidaysDate(currentYear);
	setCalendar(currentDate);
	$scope.setCalendar = function(date){
		setCalendar(date);
	}
	$scope.openDay = function(date){
		$scope.path = '/day/'+date;
		$location.url($scope.path);
	}
	function setCalendar ( date ){
		$scope.currentMonth = getDayInMonthList(date.getMonth(), date.getFullYear());
	}

	function getDayInMonthList(monthNumber, year){
		var DAY_IN_WEEK = 7,
			date = new Date(year, monthNumber),
			month = [],
			weekNumber = 0,
			firstDayInMonth = date.getDay(),
			prevDate = new Date(date),
			nextDate = new Date(date),
			prevMonthDays,
			nextMonthDays,
			checkDate;
			if(firstDayInMonth === 0){
				firstDayInMonth = 7;
			}
		if ( currentYear != year ) {
			setHolidaysDate(year);
			currentYear = year;
		}
		month[weekNumber] = [];
		month.currentMonthWithYear=date.toLocaleString("en-Us", { month : 'long', year : 'numeric' });
		month.prevMonth = new Date(prevDate.setMonth(prevDate.getMonth() - 1));
		month.nextMonth = new Date(nextDate.setMonth(nextDate.getMonth() + 1));
		
		prevMonthDays = getPrevOrNextMonthDays(date, firstDayInMonth - 1, 'prev');
		for(var i = 0; i < prevMonthDays.length; i++){
			month[weekNumber].push(prevMonthDays[i]);
		}

		while(date.getMonth() == monthNumber){
			month[weekNumber].push(checkCurrentAndWeekendDate(date));
			if(date.getDay() % DAY_IN_WEEK == 0){
				checkDate = new Date(date);
				checkDate.setDate(date.getDate() + 1);
				if(checkDate.getMonth() == monthNumber){
					month[ ++weekNumber ] = [];
				}
			}
			date.setDate(date.getDate()+1);
		}

		nextMonthDays = getPrevOrNextMonthDays(new Date(date.setDate(date.getDate()-1)), DAY_IN_WEEK-month[month.length-1].length, 'next');
		for(var i = 0; i < nextMonthDays.length; i++){
			month[month.length - 1].push(nextMonthDays[i]);
		}

		return month;
	}

	function checkCurrentAndWeekendDate(date,prevOrNext){
		var todayDate = new Date(),
			checkDate = new Date(date),
			dateObject;
		if(checkDate.setHours(0,0,0,0) == todayDate.setHours(0,0,0,0)){
			dateObject = (checkDate.getDay() === 0 || checkDate.getDay() === 6 ) ? 
					formatDateToObject( new Date(checkDate), prevOrNext , true, true) :
						formatDateToObject( new Date(checkDate), prevOrNext , false, true);
		}else{
			if (checkDate.getDay() === 0 || checkDate.getDay() === 6 ) {
				dateObject = formatDateToObject( new Date(checkDate), prevOrNext, true);
			} else {
				dateObject = formatDateToObject( new Date(checkDate) , prevOrNext);
			}
		}
		return dateObject;
	}

	function getPrevOrNextMonthDays(currentDate, emptyDaysInCurrentMonth, type){
		var result = [],
			typeDate = new Date(currentDate);
		if(type === "prev"){
			typeDate.setDate(typeDate.getDate()-emptyDaysInCurrentMonth-1);
		}
		for(var i=0; i < emptyDaysInCurrentMonth; i++){
			typeDate.setDate(typeDate.getDate()+1);
			result.push(checkCurrentAndWeekendDate(typeDate, true));
		}
		return result;
	}

	function formatDateToObject(date,other,weekend,current){
		var newDate = new Date(date),
			note = getNotesByDate(newDate),
			notes=[];
		if(typeof note == "number"){
			notes.count = note;
		}else{
			notes = note;
		}
		return {
			dayNumber: newDate.getDate(),
			url: newDate.getFullYear() + "-" + +(newDate.getMonth() + 1) + "-" + newDate.getDate(),
			other: other || false,
			weekend: weekend || false,
			current: current || false,
			notes: notes
		}
	}

	function setTimeItem(item){
		return (item < 10) ? "0" + item : item;
	}

	function getNotesByDate(checkDate){
		var resultNotes = [];
		keys = localStorageService.keys();
		keys.forEach(function(date){
			var storageDate = new Date(date);
			var toComparingCheckDate = new Date(checkDate.getFullYear(),checkDate.getMonth(),checkDate.getDate()).valueOf();
			var toComparingStorageDate = new Date(storageDate.getFullYear(),storageDate.getMonth(),storageDate.getDate()).valueOf();
			if(toComparingStorageDate === toComparingCheckDate){
				var note=JSON.parse(localStorageService.get(date));
				resultNotes.push( {
					header : note.header
				});
			}
		})
		return (resultNotes.length < 2 && resultNotes.length>0) ? resultNotes : resultNotes.length;
	}

	function setHolidaysDate(year){
		localStorageService.set(new Date(year + "-01-07 00:01"),JSON.stringify({
						header: "Nativity",
						description: "about nativity",
						cantEdit:true
					}));
		localStorageService.set(new Date(year + "-02-23 00:01"),JSON.stringify({
						header: "Army day",
						description: "about army",
						cantEdit:true
					}));
	    localStorageService.set(new Date(year + "-03-08 00:01"),JSON.stringify({
						header: "Women day",
						description: "about women",
						cantEdit:true
					}));
		localStorageService.set(new Date(year + "-04-01 00:01"),JSON.stringify({
						header: "Joke day",
						description: "about joke",
						cantEdit:true
					}));
		localStorageService.set(new Date(year + "-05-09 00:01"),JSON.stringify({
						header: "War win day",
						description: "about win day",
						cantEdit:true
					}));
		localStorageService.set(new Date(year + "-06-22 00:01"),JSON.stringify({
						header: "War II start",
						description: "about war II",
						cantEdit:true
					}));
		localStorageService.set(new Date(year + "-07-03 00:01"),JSON.stringify({
						header: "RB independence day",
						description: "about independence",
						cantEdit:true
					}));
		localStorageService.set(new Date(year + "-08-02 00:01"),JSON.stringify({
						header: "Interesting day",
						description: "about interesting",
						cantEdit:true
					}));
		localStorageService.set(new Date(year + "-09-01 00:01"),JSON.stringify({
						header: "Knowledge day",
						description: "about knowledge",
						cantEdit:true
					}));
		localStorageService.set(new Date(year + "-10-04 00:01"),JSON.stringify({
						header: "Teacher day",
						description: "about teacher",
						cantEdit:true
					}));
		localStorageService.set(new Date(year + "-11-05 00:01"),JSON.stringify({
						header: "October revolution day",
						description: "about October revolution",
						cantEdit:true
					}));
		localStorageService.set(new Date(year + "-12-25 00:01"),JSON.stringify({
						header: "Christmas day",
						description: "about christmas",
						cantEdit:true
					}));
		localStorageService.set(new Date(year + "-12-31 23:59"),JSON.stringify({
						header: "New Year day",
						description: "about new year",
						cantEdit:true
					}));
	}
}]);