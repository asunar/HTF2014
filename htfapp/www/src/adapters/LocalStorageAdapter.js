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
            },  ],

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
            },  ]


        ]
    };



    this.getGridMenuItems = function() {
        return gridMenuItems;
    };

    this.getNavigationBarItems = function() {
        return _.flatten(this.getGridMenuItems().rows);
    };

    this.populateConfDays = function() {
			var xhr = getHTTPObject();

			xhr.open("GET", "http://jsbin.com/nikuwo.js");

			xhr.onreadystatechange = function() {
					if (xhr.readyState == 4 && xhr.status == 200) {
							console.log('Updated from server');
							localStorage.setItem("TCA:ConfDays", xhr.responseText);
							return;
					} else {
						if (xhr.readyState == 4){
						 console.log("Request failed");
							var confDays = localStorage["TCA:ConfDays"];
							if (confDays) {
									console.log('Loaded from localStorage');
							} else {
									console.log('Loaded seed data');
									var seedData = new HTF2014Data().getAcceptedSessionsByTimeSlot(); 
									localStorage.setItem("TCA:ConfDays", JSON.stringify(seedData));
							}

						}
					} 

			}

			

			xhr.send(null);				

				
			 				

				//if not connected 
				//	if localStorage is empty then load from HTF2014Data
				//	else load from localStorage
				//if connected
				//	send an XHR request to get latestSchedule since date x
				//	if null/empty then load from localStorage
				//	else store resp in localStorage, return resp 
        return new HTF2014Data().getAcceptedSessionsByTimeSlot();
    };

    this.getSpeakers = function() {
        return new HTF2014Data().getSpeakers();
    };

    this.populateConfDays123 = function() {
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
