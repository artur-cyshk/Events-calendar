app.controller('DayCtrl', ['$scope', '$stateParams', 'localStorageService', function($scope, $stateParams, localStorageService){
	$scope.resultDayShedule = getNotes();
	$scope.currentDate = new Date($stateParams.date).toLocaleString("en-US",{year:'numeric',month:'long',day:'numeric',weekday: 'long'});
	$scope.emptyDayNotes = checkEmptyDay.call($scope.resultDayShedule);

	$scope.addNote = function(){
		addNote($scope.note);
	}

	$scope.editNote = function(){
		if(addNote($scope.noteToEdit, true)){
			if($scope.noteToEdit.oldMinute != $scope.noteToEdit.minute || $scope.noteToEdit.oldHour != $scope.noteToEdit.hour){
				$scope.deleteNote($scope.noteToEdit.oldDate);
			}
		}
	}

	$scope.deleteNote = function(date){
		localStorageService.remove(new Date(date));
		$scope.resultDayShedule = getNotes();
		$scope.emptyDayNotes = checkEmptyDay.call($scope.resultDayShedule);
	}

	$scope.openDeleteNoteModal=function(key){
		$scope.noteKeyToDelete = key;
	}

	$scope.openAddNoteModal = function(ev){
		$scope.newNoteError = {};
		setMinutesAndHoursToScope();
	}

	$scope.openEditNoteModal = function(key){
		var date = new Date(key),
			noteToEdit = JSON.parse(localStorageService.get(date));
		$scope.newNoteError = {};
		noteToEdit.key = key;
		noteToEdit.oldHour = setTimeItem(date.getHours());
		noteToEdit.oldMinute = setTimeItem(date.getMinutes());
		noteToEdit.oldDate = date;
		$scope.noteToEdit = noteToEdit;
		setMinutesAndHoursToScope();
	}

	function addNote (noteInfo,editFlag){
		var errorFlag = false,
			selectedDate,
			now,
			today;
		$scope.newNoteError = {};
		if( noteInfo ){
			if(!noteInfo.header){
				$scope.newNoteError.headerError = true;
				errorFlag = true;
			}
			if(!/(^|[\s\,\.\+\-\_\$\^\(\)]+)([а-я\w]+([\s\,\.\+\-\_\$\^\(\)]+|$)){5,}/i.test( noteInfo.description ) && noteInfo.description){
				$scope.newNoteError.descriptionError = true;
				errorFlag = true;
			}
			if(!noteInfo.hour || !noteInfo.minute){
				if(arguments.length < 2){
					$scope.newNoteError.timeError = true;
					errorFlag = true;
				}
			}
			if(errorFlag){
				return;
			}
		}else{
			$scope.newNoteError.emptyFormError = true;
			return;
		}
		if(arguments.length > 1){
			if(!noteInfo.hour){
				noteInfo.hour = noteInfo.oldHour;
			}
			if(!noteInfo.minute){
				noteInfo.minute = noteInfo.oldMinute;
			}
		}
		selectedDate = new Date($stateParams.date+" "+noteInfo.hour+":"+noteInfo.minute);
		if(arguments.length<2){
			now = new Date();
			today = new Date(now.getFullYear(), now.getMonth(), now.getDate(),now.getHours(),now.getMinutes()).valueOf();
			if(selectedDate.valueOf()<today){
				$scope.newNoteError.pastError = true;
				return;
			}
		}
		localStorageService.set(selectedDate, JSON.stringify({
			'header': noteInfo.header,
			'description': noteInfo.description
		}));
		$scope.resultDayShedule = getNotes();
		$scope.emptyDayNotes = checkEmptyDay.call($scope.resultDayShedule);
		$('.closeNoteModal').click();
		return true;		
	}

	function getNotes(){
		var hours = getTime().hours,
		keys = localStorageService.keys();
		return hours.map(function(item){
			var resultHourNotes = [];
			keys.forEach(function(date){
				var checkDate = new Date($stateParams.date + " " + item + ":00"),
					storageDate = new Date(date),
					toComparingCheckDate = new Date(checkDate.getFullYear(),checkDate.getMonth(),checkDate.getDate(),checkDate.getHours()).valueOf(),
					toComparingStorageDate = new Date(storageDate.getFullYear(),storageDate.getMonth(),storageDate.getDate(),storageDate.getHours()).valueOf();
				if(toComparingStorageDate === toComparingCheckDate){
					var note=JSON.parse(localStorageService.get(date));
					resultHourNotes.push( {
						key: date,
						header : note.header,
						description: note.description,
						cantEdit: note.cantEdit || false,
						time: setTimeItem(new Date(date).getHours()) + " : " + setTimeItem(new Date(date).getMinutes())
					});
				}
			})
			return {
				hour: item,
				notes: resultHourNotes
			}
		})
	}

	function setMinutesAndHoursToScope(){
		$scope.time = {};
		$scope.time.hours = getTime().hours;
		$scope.time.minutes = getTime().minutes;
	}

	function getTime(){
		var HOURS_COUNT = 24,
			MINUTES_COUNT = 60;
		return { 
			hours : setTime(HOURS_COUNT),
			minutes : setTime(MINUTES_COUNT)
		}
	}

	function setTimeItem(item){
		return (item<10) ? "0" + item : item;
	}

	function setTime(count){
		var timeArr = [];
		for(var i = 0; i < count; i++){
			if( i < 10){
				i = '0'+i;
			}
			timeArr.push(i);
		}
		return timeArr;
	}

	function checkEmptyDay(){
		var length=0;
		this.forEach(function(item){
			if(item.notes.length > 0){
				length++;
			}
		})
		return !length;
	}

}]);