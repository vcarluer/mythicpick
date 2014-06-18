var mythic = function() {};
(function() {
    "use strict";
    mythic.prototype.create = function (divMythic) {
        this.divMain = document.getElementById(divMythic);
        
        this.divRoll = document.createElement("div");
        this.divRoll.setAttribute("class", "divMain");
        this.divMain.appendChild(this.divRoll);
        
        this.divParam = document.createElement("div");
        this.divParam.setAttribute("class", "divMain");
        this.divMain.appendChild(this.divParam);
        
        this.divResult = document.createElement("div");
        this.divResult.setAttribute("class", "divMain");
        this.divMain.appendChild(this.divResult);
        
        this.initFateOdds();
        this.initEventFocus();
        this.initEventMeaningActions();
        this.initEventMeaningSubjects();
        this.initFateChart();
        
        this.createDivRoll();
    };
    
    mythic.prototype.createDivRoll = function () {
        var self = this;
        var label = document.createElement("h2");
        label.innerHTML = "Choose a roll"
        this.divRoll.appendChild(label);
        
        var buttonEvent = document.createElement("input");
        buttonEvent.setAttribute("type", "button");
        buttonEvent.setAttribute("value", "Random event");
        buttonEvent.onclick = function () {
                self.startRandomEvent();
        };
        
        this.divRoll.appendChild(buttonEvent);
        this.divRoll.appendChild(document.createElement("br"));
        
        var buttonScene = document.createElement("input");
        buttonScene.setAttribute("type", "button");
        buttonScene.setAttribute("value", "Modify the scene");
        buttonScene.onclick = function () {
            self.startModifyScene();  
        };
        
        this.divRoll.appendChild(buttonScene);
        this.divRoll.appendChild(document.createElement("br"));
        
        var buttonQuestion = document.createElement("input");
        buttonQuestion.setAttribute("type", "button");
        buttonQuestion.setAttribute("value", "Yes / No Question");
        buttonQuestion.onclick = function () {
            self.startQuestion();
        };
        
        this.divRoll.appendChild(buttonQuestion);
        this.divRoll.appendChild(document.createElement("br"));  
    };
    
    mythic.prototype.startRandomEvent = function () {
        this.startMode();
        this.createResultHeader();
        this.printRandomEvent();
    };
    
    mythic.prototype.startModifyScene = function () {
        var self = this;
        this.startMode();
        this.createParamHeader();
        this.createChaosParam();
        this.createParamContinue(function () { self.endModifyScene(); });
    };
    
    mythic.prototype.endModifyScene = function () {
        this.clearResult();
        this.createResultHeader();
        
        var chaos = this.chaosSelect.options[this.chaosSelect.selectedIndex].value;
        var sceneChange = Math.floor(Math.random()  * 9) + 1;
        var result = "No change";
        if (sceneChange <= chaos) {
            if (sceneChange % 2 === 0) {
                result = "INTERRUPT scene";
            } else {
                result = "ALTERED scene";
            }
        }
        
        this.addResult("Scene", result);
        this.printRandomEvent();
    };
    
    mythic.prototype.startQuestion = function () {
        var self = this;
        this.startMode();
        this.createParamHeader();
        this.createChaosParam();
        this.createQuestionParam();
        this.createOddParam();
        this.createParamContinue(function () { self.endQuestion(); });
    };
    
    mythic.prototype.endQuestion = function () {
        this.clearResult();
        this.createResultHeader();
        
        var chaos = this.chaosSelect.options[this.chaosSelect.selectedIndex].value;
        var odds = this.oddsSelect.options[this.oddsSelect.selectedIndex].value;
        
        var fateChartRoll = Math.floor(Math.random() * 100);
        this.addResult("ROLL", fateChartRoll);
        this.fateRoll(chaos, odds, fateChartRoll);
        
        var strRoll = fateChartRoll.toString();
        if (strRoll.length > 1 && strRoll.charAt(0) === strRoll.charAt(1)) {
            this.addResult("RANDOM event!!", strRoll);
            this.printRandomEvent();
        }
    };
    
    mythic.prototype.fateRoll = function (chaos, odd, roll) {
        var chaosIdx = chaos - 1;
        var max = this.fateChart[chaosIdx][odd];
        this.addResult("% success", max);
        var result = "";
        if (roll <= max) {
            result = "YES";
            if (roll <= (max / 5)) {
                result += " Exceptional!";
            }
        } else {
            result = "NO";
            if (roll >= (100 - ((100 - max) /5))) {
                result += " Exceptional!";
            }
        }
        
        this.addResult("Answer", result);
    };
    
    mythic.prototype.createQuestionParam = function() {
        var p = document.createElement("p");
        var label = document.createElement("label");
        label.innerHTML = "Ask a yes/no question: ";
        p.appendChild(label);
        var txt = document.createElement("input");
        txt.setAttribute("value", "yes or no?")
        p.appendChild(txt);
        
        this.divParam.appendChild(p);
    };
    
    mythic.prototype.createOddParam = function () {
        var p = document.createElement("p");
        var label = document.createElement("label");
        label.innerHTML = "Choose the odds: ";
        p.appendChild(label);
        
        if (!this.oddsSelect) {
            this.oddsSelect = document.createElement("select");
            
            for (var i = 0; i < this.fateOdds.length; i++) {
                var opt = document.createElement("option");
                opt.text = this.fateOdds[i];
                opt.value = i;
                this.oddsSelect.options.add(opt);
            }
        }
        
        this.oddsSelect.selectedIndex = 4;
        
        p.appendChild(this.oddsSelect);
        this.divParam.appendChild(p);
    };
    
    mythic.prototype.createParamContinue = function(callback) {
        var p = document.createElement("p");
        var button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", "Continue");
        button.onclick = function() { callback(); };
        p.appendChild(button);
        this.divParam.appendChild(p);
    };
    
    mythic.prototype.createChaosParam = function () {
        var p = document.createElement("p");
        var label = document.createElement("label");
        label.innerHTML = "Chaos factor: ";
        p.appendChild(label);
        
        if (!this.chaosSelect) {
            this.chaosSelect = document.createElement("select");
            
            for (var i = 1; i <= 9; i++) {
                var opt = document.createElement("option");
                opt.text = i;
                opt.value = i;
                this.chaosSelect.options.add(opt);
            }
        }
        
        this.chaosSelect.selectedIndex = 4;
        
        p.appendChild(this.chaosSelect);
        this.divParam.appendChild(p);
    };
    
    mythic.prototype.printRandomEvent = function () {
        var focusIdx = this.getEventFocusIndex();
        var focus = this.eventFocus[focusIdx];
        
        this.addResult("Focus", focus);
        
        var actionIdx = Math.floor(Math.random() * this.eventMeaningActions.length);
        var action = this.eventMeaningActions[actionIdx];
        
        this.addResult("Action", action);
        
        var subjectIdx = Math.floor(Math.random() * this.eventMeaningSubjects.length);
        var subject = this.eventMeaningSubjects[subjectIdx];
        
        this.addResult("Subject", subject);
    };
    
    mythic.prototype.addResult = function (label, value) {
        var p = document.createElement("p");
        var labelResult = document.createElement("label");
        labelResult.innerHTML = label + ": ";
        p.appendChild(labelResult);
        var valueResult = document.createElement("label");
        valueResult.innerHTML = value;
        p.appendChild(valueResult);
        this.divResult.appendChild(p);
    };
    
    mythic.prototype.startMode = function () {
      this.clearParams();
      this.clearResult();
    };
    
    mythic.prototype.createResultHeader = function() {
      var resultHeader = document.createElement("h2");
      resultHeader.innerHTML = "Result";
      this.divResult.appendChild(resultHeader);  
    };
    
    mythic.prototype.createParamHeader = function() {
      var resultHeader = document.createElement("h2");
      resultHeader.innerHTML = "Parameters";
      this.divParam.appendChild(resultHeader);  
    };
    
    mythic.prototype.clearParams = function () {
        while (this.divParam.hasChildNodes()) {
            this.divParam.removeChild(this.divParam.lastChild);
        }
    };
    
    mythic.prototype.clearResult = function () {
        while (this.divResult.hasChildNodes()) {
            this.divResult.removeChild(this.divResult.lastChild);
        }
    };
    
    mythic.prototype.getEventFocusIndex = function () {
        var percentrand = Math.floor(Math.random() * 100);
        if (percentrand >= 0 && percentrand <= 6) return 0;
        if (percentrand >= 7 && percentrand <= 27) return 1;
        if (percentrand >= 28 && percentrand <= 34) return 2;
        if (percentrand >= 35 && percentrand <= 44) return 3;
        if (percentrand >= 45 && percentrand <= 51) return 4;
        if (percentrand >= 52 && percentrand <= 54) return 5;
        if (percentrand >= 55 && percentrand <= 66) return 6;
        if (percentrand >= 67 && percentrand <= 74) return 7;
        if (percentrand >= 75 && percentrand <= 82) return 8;
        if (percentrand >= 83 && percentrand <= 91) return 9;
        if (percentrand >= 92 && percentrand <= 99) return 10;
        
        return 0;
    };
    
    mythic.prototype.initEventFocus = function () {
        this.eventFocus = [
            "Remote event",
            "NPC action",
            "Introduce a new NPC",
            "Move toward a thread",
            "Move away from a thread", 
            "Close a thread",
            "PC negative",
            "PC positive",
            "Ambiguous event",
            "NPC negative",
            "NPC positive"];
    };
    
    mythic.prototype.initEventMeaningActions = function () {
        this.eventMeaningActions = [
        "Attainment",
        "Starting",
        "Neglect ",
        "Fight",
        "Recruit",
        "Triumph",
        "Violate",
        "Oppose",
        "Malice",
        "Communicate",
        "Persecute",
        "Increase",
        "Decrease",
        "Abandon",
        "Gratify",
        "Inquire",
        "Antagonise",
        "Move",
        "Waste",
        "Truce",
        "Release",
        "Befriend",
        "Judge",
        "Desert",
        "Dominate",
        "Procrastinate",
        "Praise",
        "Separate",
        "Take",
        "Break",
        "Heal",
        "Delay",
        "Stop",
        "Lie",
        "Return",
        "Immitate",
        "Struggle",
        "Inform",
        "Bestow",
        "Postpone",
        "Expose",
        "Haggle",
        "Imprison",
        "Release",
        "Celebrate",
        "Develop",
        "Travel",
        "Block",
        "Harm",
        "Debase",
        "Overindulge",
        "Adjourn",
        "Adversity",
        "Kill",
        "Disrupt",
        "Usurp",
        "Create",
        "Betray",
        "Agree",
        "Abuse",
        "Oppress",
        "Inspect",
        "Ambush",
        "Spy",
        "Attach",
        "Carry",
        "Open",
        "Carelessness",
        "Ruin",
        "Extravagance",
        "Trick",
        "Arrive",
        "Propose",
        "Divide",
        "Refuse",
        "Mistrust",
        "Deceive",
        "Cruelty",
        "Intolerance",
        "Trust",
        "Excitement",
        "Activity",
        "Assist",
        "Care",
        "Negligence",
        "Passion",
        "Work hard",
        "Control",
        "Attract",
        "Failure",
        "Pursue",
        "Vengeance",
        "Proceedings",
        "Dispute",
        "Punish",
        "Guide",
        "Transform",
        "Overthrow",
        "Oppress",
        "Change"];
    };
    
    mythic.prototype.initEventMeaningSubjects = function () {
        this.eventMeaningSubjects = [
        "Goals",
        "Dreams",
        "Environment",
        "Outside",
        "Inside",
        "Reality",
        "Allies",
        "Enemies",
        "Evil ",
        "Good",
        "Emotions",
        "Opposition",
        "War",
        "Peace",
        "The innocent",
        "Love",
        "The spiritual",
        "The intellectual",
        "New ideas",
        "Joy",
        "Messages",
        "Energy",
        "Balance",
        "Tension",
        "Friendship",
        "The physical",
        "A project",
        "Pleasures",
        "Pain",
        "Possessions",
        "Benefits",
        "Plans",
        "Lies",
        "Expectations",
        "Legal matters",
        "Bureaucracy",
        "Business ",
        "A path",
        "News",
        "Exterior factors",
        "Advice",
        "A plot",
        "Competition",
        "Prison",
        "Illness",
        "Food",
        "Attention",
        "Success",
        "Failure",
        "Travel",
        "Jealousy",
        "Dispute",
        "Home",
        "Investment",
        "Suffering",
        "Wishes",
        "Tactics",
        "Stalemate",
        "Randomness",
        "Misfortune",
        "Death",
        "Disruption",
        "Power",
        "A burden",
        "Intrigues",
        "Fears",
        "Ambush",
        "Rumor",
        "Wounds ",
        "Extravagance",
        "A representative",
        "Adversities",
        "Opulence",
        "Liberty",
        "Military",
        "The mundane",
        "Trials",
        "Masses",
        "Vehicle",
        "Art",
        "Victory",
        "Dispute",
        "Riches",
        "Status quo",
        "Technology",
        "Hope",
        "Magic",
        "Illusions",
        "Portals",
        "Danger",
        "Weapons",
        "Animals",
        "Weather",
        "Elements",
        "Nature",
        "The public",
        "Leadership",
        "Fame",
        "Anger",
        "Information"];
    };
    
    mythic.prototype.initFateOdds = function () {
        this.fateOdds = [
        "Impossible",
        "No way",
        "Very unlikely",
        "Unlikely",
        "50/50",
        "Somewhat likely",
        "Likely",
        "Very likely",
        "Near sure thing",
        "A sure thing",
        "Has to be"];
    };
    
    mythic.prototype.initFateChart = function () {
      this.fateChart = [
                        [ -20, 0, 5, 5, 10, 20, 25, 45, 50, 55, 80 ],
                        [ 0, 5, 5, 10, 15, 25, 35, 50, 55, 65, 85 ],
                        [ 0, 5, 10, 15, 25, 45, 50, 65, 75, 80, 90 ],
                        [ 5, 10, 15, 20, 35, 50, 55, 75, 80, 85, 95 ],
                        [ 5, 15, 25, 35, 50, 65, 75, 85, 90, 90, 95 ],
                        [ 10, 25, 45, 50, 65, 80, 85, 90, 95, 95, 100 ],
                        [ 15, 35, 50, 55, 75, 85, 90, 95, 95, 95, 100 ],
                        [ 25, 50, 65, 75, 85, 90, 95, 95, 100, 110, 130 ],
                        [ 50, 75, 85, 90, 95, 95, 100, 105, 115, 125, 145 ]
                ];  
    };
}());

window.onload = function () {
	"use strict";
   var mythicPick = new mythic();
   mythicPick.create("mythic");
};