console.dir(window.document);
// var buttonEl = document.querySelector("#save-task");
var formEl = document.querySelector("#task-form");
console.log(formEl);
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];



var taskFormHandler = function(event) {
    event.preventDefault();
    // console.log(event);
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    // console.log(taskNameInput);
    // console.dir(taskNameInput);
    // console.log(taskTypeInput);
    var isEdit = formEl.hasAttribute("data-task-id");
    // console.log(isEdit);

    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        var completeEditTask = function(taskName, taskType, taskId) {
            // console.log(taskName, taskType, taskId);
            var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

            //set new values after editing
            taskSelected.querySelector("h3.task-name").textContent = taskName;
            taskSelected.querySelector("span.task-type").textContent = taskType;
            alert("Task Updated!");

            //loop through tasks array and task object with new content
            for (var i=0; i < tasks.length; i++) {
                if (tasks[i].id === parseInt(taskId)) {
                    tasks[i].name = taskName;
                    tasks[i].type = taskType;
                }
            }

            //to reset the submit form
            formEl.removeAttribute("data-task-id");
            document.querySelector("#save-task").textContent = "Add Task";

            saveTasks();
        }
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // has no data attribute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
    
        createTaskEl(taskDataObj);



    }



    if(!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset();





}


var createTaskEl = function(taskDataObj) {
    //new code
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    listItemEl.setAttribute("draggable", "true");
    // console.log(taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);


    var taskActionsEl = createTaskActions(taskIdCounter);
    // console.log(taskActionsEl);
    listItemEl.appendChild(taskActionsEl);
    tasksToDoEl.appendChild(listItemEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);


    //increase task counter for next unique id
    taskIdCounter++;

    // console.log(taskDataObj);
    // console.log(taskDataObj.status);
    saveTasks();

}



// new function to create the buttons on the form to manage content
var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);



    return actionContainerEl;

}


//definition of editTask function
var editTask = function(taskId) {
    console.log("editing task #" + taskId);
  
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id", taskId);
  };



//definition of deleteTask function
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove(taskId);

    //create new array to hold updated list of tasks
    var updatedTaskArr = [];
    //loop through current tasks
    for (var i = 0; i<tasks.length; i++) {
        //if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
  };



//definition of taskButtonHandler function
var taskButtonHandler = function(event) {
    // console.log(event.target);
    var targetEl = event.target;

    //if edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }

  };



//definition of taskStatusChangeHandler function
  var taskStatusChangeHandler = function(event) {
      console.log(event.target);
      console.log(event.target.getAttribute("data-task-id"));

      //get the task item's id
      var taskId = event.target.getAttribute("data-task-id");

      //get the currently selected option's value and convert to lowercase
      var statusValue = event.target.value.toLowerCase();

      //find the parent task item element based on the id
      var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

      if (statusValue === "to do") {
          tasksToDoEl.appendChild(taskSelected);
      }

      else if (statusValue === "in progress") {
          tasksInProgressEl.appendChild(taskSelected);
      }

      else if (statusValue === "completed") { 
          tasksCompletedEl.appendChild(taskSelected);
      }

      //update task's in tasks array
      for (var i=0; i < tasks.length; i++) {
          if(tasks[i].id === parseInt(taskId)) {
              tasks[i].status = statusValue;
          }
      }

      saveTasks();


  }


  //definition of dragTaskHandler function
  var dragTaskHandler = function(event) {
    // console.log("event.target:", event.target);
    // console.log("event.type:", event.type);

    var taskId = event.target.getAttribute("data-task-id");
    // console.log("TaskID:", taskId);
    // console.log("event", event);
    event.dataTransfer.setData("text/plain", taskId);
    var getId = event.dataTransfer.getData("text/plain");
    console.log("getId:", getId, typeof getId);
  }



//definition of dropZoneDragHandler function
var dropZoneDragHandler = function(event) {
    // console.log("Dragover Event Target:", event.target);
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
        // console.dir(taskListEl);
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dragTaskHandler;");

    }

}


//definition of dropTaskHandler function
var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    // console.log("Drop Event Target:", event.target, event.dataTransfer, id);
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    // console.log(draggableElement);
    // console.dir(draggableElement);
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
    // console.log(statusType);
    // console.log(dropZoneEl);
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    // console.dir(statusSelectEl);
    // console.log(statusSelectEl);
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }
    dropZoneEl.appendChild(draggableElement);
    dropZoneEl.removeAttribute("style");

    //loop though tasks array to find and update the updated task's status
    for (var i=0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }
    console.log(tasks);

    saveTasks();

}


//definition of dragLeaveHandler function
var dragLeaveHandler = function(event) {
    // console.dir(event.target);
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}


//method to save tasks to the backend
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");
  
    if (!savedTasks) {
      return false;
    }
  
    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the `createTaskEl()` function
    createTaskEl(savedTasks[i]);
  }
  }



// eventListeners go here
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);