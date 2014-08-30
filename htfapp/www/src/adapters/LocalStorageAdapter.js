var LocalStorageAdapter = function() {

    this.initialize = function() {
        this.populateConfDays();
        this.markSessionsInMySchedule();
    }


    var gridMenuItems = {
        rows: [
            [{
                id: 'lnkSessions',
                url: '#sessions',
                label: 'Sessions',
                icon: 'fa fa-calendar-o'
            }, {
                id: 'lnkSpeakers',
                url: '#speakers',
                label: 'Speakers',
                icon: 'fa fa-user'
            }, {
                id: 'lnkFamilySessions',
                url: '#familysessions',
                label: 'Family Sessions',
                icon: 'fa fa-child'
            }, ],

            [{
                id: 'lnkMySchedule',
                url: '#myschedule',
                label: 'My Schedule',
                icon: 'fa fa-check-square-o'
            }, {
                id: 'lnkMap',
                url: '#map',
                label: 'Map',
                icon: 'fa fa-map-marker'
            }, {
                id: 'lnkCodeOfConduct',
                url: '#policies',
                label: 'Code of Conduct',
                icon: 'fa fa-book'
            }, ]


        ]
    };



    this.getGridMenuItems = function() {
        return gridMenuItems;
    };

    this.getNavigationBarItems = function() {
        return _.flatten(this.getGridMenuItems().rows);
    };

    this.getAcceptedSessionsByTimeSlot = function() {
        return new HTF2014Data().getAcceptedSessionsByTimeSlot();
    };

    this.getSpeakers = function() {
        return new HTF2014Data().getSpeakers();
    };

    this.populateConfDays = function() {


        localStorage.setItem("TCA:ConfDays", JSON.stringify( this.getAcceptedSessionsByTimeSlot()));
    };

		this.getTimeOddEvenMap = function(confDays){
			var accumulatedMap = {}
			_.uniq(_.flatten(confDays.map(function(s) {
								return s.Sessions;
						})).map(function(aSession) {
								return aSession.Time.replace(':',''); //colon breaks JSON
						})).forEach(function(t, i) {
								accumulatedMap[t] = i % 2 === 0 ? "even" : "odd";
						});
			return accumulatedMap;
		}

    this.getSessions = function() {
        var storedConfDays = JSON.parse(localStorage["TCA:ConfDays"]);
				var timeOddEvenMap = this.getTimeOddEvenMap(storedConfDays);
        var that = this;
        storedConfDays.forEach(function(d) {
            d.Sessions.forEach(function(s) {
                s.IsInMySchedule = that.isSessionInMySchedule(s.Id);
								s.OddOrEvenTime = timeOddEvenMap[s.Time.replace(':','')]; 
            });
        });
        return storedConfDays;
    };

    this.markSessionsInMySchedule = function() {
        var sessionIdsInMySchedule = this.getSessionIdsInMySchedule();
        var that = this;
        sessionIdsInMySchedule.forEach(function(sessionId) {
            that.getSessionById(sessionId).IsUserFavorite = true;
        });
    };



    this.getSessionsBySpeaker = function(speakerUserName) {
        return this.getSessions().map(function(d) {
            return {
                Day: d.Day,
                Sessions: d.Sessions.filter(function(s) {
                    return _.contains(s.Speakers.map(function(speaker){
											return speaker.UserName;
										}), speakerUserName);
                })
            }
        }).filter(function(day) {
            return day.Sessions.length > 0;
        })
    }

    this.getSessionsByCategory = function(category) {
        return this.getSessions().map(function(d) {
            return {
                Day: d.Day,
                Sessions: d.Sessions.filter(function(s) {
                    return s.Category === category;
                })
            }
        }).filter(function(day) {
            return day.Sessions.length > 0;
        })
    };

    this.getSessionById = function(id) {
        return this.getSessions().map(function(d) {
            return {
                Day: d.Day,
                Sessions: d.Sessions.filter(function(s) {
                    return s.Id === id;
                })
            }
        }).filter(function(day) {
            return day.Sessions.length > 0;
        })
    };

    this.getSessionIdsInMySchedule = function() {
        var storedIds = localStorage["TCA:SessionsInMySchedule"];
        if (storedIds) {
            return JSON.parse(storedIds);
        } else {
            return [];
        }
    };

    this.saveSessionsInMySchedule = function(sessionsInMySchedule) {
        localStorage.setItem("TCA:SessionsInMySchedule", JSON.stringify(sessionsInMySchedule));
    };

    this.addToMySchedule = function(id) {
        var sessionsInMySchedule = this.getSessionIdsInMySchedule();
        sessionsInMySchedule.push(id);
        this.saveSessionsInMySchedule(sessionsInMySchedule);
    };

    this.removeFromMySchedule = function(id) {
        var sessionsInMySchedule = this.getSessionIdsInMySchedule();
        sessionsInMySchedule = sessionsInMySchedule.filter(function(savedId) {
            return savedId !== id;
        });
        this.saveSessionsInMySchedule(sessionsInMySchedule);
    }


    this.getSessionsInMySchedule = function() {
        var sessionIdsInMySchedule = this.getSessionIdsInMySchedule();
        return this.getSessions().map(function(d) {
            return {
                Day: d.Day,
                Sessions: d.Sessions.filter(function(s) {
                    return _.contains(sessionIdsInMySchedule, s.Id);
                })
            }
        }).filter(function(day) {
            return day.Sessions.length > 0;
        });
    };

		this.getSessionsInMySchedule_TimeOddEvenMap = function() {
			var confDays = this.getSessionsInMySchedule();
			var timeOddEvenMap = this.getTimeOddEvenMap(confDays);
			
        var that = this;
        confDays.forEach(function(d) {
            d.Sessions.forEach(function(s) {
								s.OddOrEvenTime = timeOddEvenMap[s.Time.replace(':','')]; 
            });
        });
        return confDays;			
		} 

    this.isSessionInMySchedule = function(id) {
        return _.contains(this.getSessionIdsInMySchedule(), id);
    };

    this.initialize();



};
