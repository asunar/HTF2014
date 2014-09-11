(function() {

		function onDeviceReady() {
				if (parseFloat(window.device.version) === 7.0) {
							document.body.style.marginTop = "20px";
				}
		}		

		document.addEventListener('deviceready', onDeviceReady, false);

    var adapter = new LocalStorageAdapter();

    /* --------------------------------- Event Registration -------------------------------- */
    window.addEventListener('hashchange', route);

    /* ---------------------------------- Local Functions ---------------------------------- */

    (function initializeNavigationBar() {
        var navbar = document.getElementById('navbar');
        replaceChildren(navbar, new NavigationBarView(adapter).render());
    })();


    function replaceChildren(parentElement, children) {
        parentElement.innerHTML = '';
        parentElement.appendChild(children);
    }

    function route() {
        var hash = window.location.hash;
        var content = document.getElementById('content');

        var showHome = function() {
            replaceChildren(content, new HomeView(adapter).render());
        };

        var showSessions = function() {
            var sessionsToDisplay = adapter.getSessions();
            replaceChildren(content, new SessionsView(sessionsToDisplay, adapter).render());
        };

        var showSpeakers = function() {
            var speakersToDisplay = adapter.getSpeakers();
            replaceChildren(content, new SpeakersView(speakersToDisplay).render());

        };
        if (!hash) {
            showHome();
            return;
        }

        var showSessionsBySpeakers = function() {
            var speakers = getUrlVars().speakers;
            var sessionsToDisplay = adapter.getSessionsBySpeaker(speakers);
            replaceChildren(content, new SessionsView(sessionsToDisplay, adapter).render());

        };

        var showSessionDetails = function() {
            var id = parseInt(getUrlVars().id, 10);
            var sessionToDisplay = adapter.getSessionById(id);
            replaceChildren(content, new SessionDetailsView(sessionToDisplay).render());
        };

        var showMySchedule = function() {
            var sessionsToDisplay = adapter.getSessionsInMySchedule_TimeOddEvenMap();
            replaceChildren(content, new SessionsView(sessionsToDisplay, adapter).render());
        };

        var showMap = function() {
            replaceChildren(content, new MapView().render());
        };

        var hashWithoutQueryString = hash;
        if (hash.lastIndexOf('?') !== -1) {
            hashWithoutQueryString = hash.substring(0, hash.lastIndexOf('?'))
        }

        var routeTable = {
            '#home': showHome,
            '#sessions': showSessions,
            '#speakers': showSpeakers,
            '#showsessionsbyspeaker': showSessionsBySpeakers,
            '#sessiondetails': showSessionDetails,
            '#myschedule': showMySchedule,
            '#map': showMap,
        };

        routeTable[hashWithoutQueryString]();
    }

    route();
})();
