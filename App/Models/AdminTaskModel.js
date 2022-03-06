const mongoose = require("mongoose")

const adminTaskSchema = new mongoose.Schema({
  title:{type:String,require:true},
  task:{type:String,require:true},
  subjectTag: {type:String , required:true , enum:["گرافیک","برنامه نویسی","مدیریت","دیگر"]},
  executors:{type:Array,require:true},
  assignedBy:{type:Object,require:true},
  done:{type:Boolean,default:false},
  delayed:{type:Boolean,default:false},
  startDate:{type:Date,required:true},
  finishDate:{type:Date,required:true}
  
})

const adminTaskModel = new mongoose.model("tasks",adminTaskSchema);

class Filter
{
  constructor(tasks,days,subject,userId)
  {
    this.tasks=tasks
    this.days=days
    this.subject=subject
    this.userId=userId
  }

  byDays ()
  {
    let tasks  = this.tasks ;
    let days = this.days ;
    if(!tasks) return this.tasks = []
    if(days) 
    { 
      let filteredTasks = []
      for(let i = 0 ; i<tasks.length;i++)
      {
        if(Math.floor((tasks[i].finishDate.getTime()-Date.now())/(24*60*60*1000))>=days)
        {
          filteredTasks.push(tasks[i]);
        }
      }
      return this.tasks = filteredTasks;
    }
    else return 
  }
    
  bySubject()
  {
    let tasks  = this.tasks ;
    let subject = this.subject ;
    if(!tasks) return this.tasks = []
  
    if (subject)
    {
      let filteredTasks = []
      for(let i = 0 ; i<tasks.length;i++)
      {
        if(tasks[i].subjectTag==subject)
        {
          filteredTasks.push(tasks[i]);
        }
      }
      return this.tasks = filteredTasks;
    }
    else return
  }

  byUserId()
  {
    let tasks= this.tasks;
    let userId = this.userId;
    if(!tasks) return this.tasks=[]

    if (userId)
    {
      let filteredTasks=[];
      for(let i=0; i<tasks.length;i++)
      {
        for(let j=0; j<tasks[i].executors.length;j++)
        {
          if (tasks[i].executors[j]._id===userId)
          {
            filteredTasks.push(tasks[i]);
          }
        }
      }
      return this.tasks=filteredTasks;
    }
    else return

  }
}


module.exports = {adminTaskModel, Filter};