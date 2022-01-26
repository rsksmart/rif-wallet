import Realm from 'realm'

class MyTask {
  public static schema: Realm.ObjectSchema = {
    name: 'Task',
    properties: {
      _id: 'int',
      name: 'string',
      status: 'string?',
    },
    primaryKey: '_id',
  }

  public _id: number | undefined
  public name: string | undefined
  public status?: string | null
}

export async function quickStart() {
  const realm = await Realm.open({
    path: 'myrealm',
    schema: [MyTask.schema],
  })

  // Add a couple of Tasks in a single, atomic transaction
  let task1: (MyTask & Realm.Object) | null
  let task2: (MyTask & Realm.Object) | null

  realm.write(() => {
    task1 = realm.create<MyTask>(MyTask.schema.name, {
      _id: 1,
      name: 'go grocery shopping',
      status: 'Open',
    })

    task2 = realm.create<MyTask>(MyTask.schema.name, {
      _id: 2,
      name: 'go exercise',
      status: 'Open',
    })
    console.log(`created two tasks: ${task1.name} & ${task2.name}`)
  })
  // use task1 and task2

  // query realm for all instances of the "Task" type.
  const tasks = realm.objects<MyTask>(MyTask.schema.name)
  console.log(`The lists of tasks are: ${tasks.map(task => task.name)}`)

  // filter for all tasks with a status of "Open"
  const openTasks = tasks.filtered("status = 'Open'")
  console.log(
    `The lists of open tasks are: ${openTasks.map(openTask => openTask.name)}`,
  )

  // Sort tasks by name in ascending order
  const tasksByName = tasks.sorted('name')
  console.log(
    `The lists of tasks in alphabetical order are: ${tasksByName.map(
      taskByName => taskByName.name,
    )}`,
  )

  // Define the collection notification listener
  function listener(
    collection: Realm.Collection<MyTask & Realm.Object>,
    changes: Realm.CollectionChangeSet,
  ) {
    // Update UI in response to deleted objects
    changes.deletions.forEach(index => {
      // Deleted objects cannot be accessed directly,
      // but we can update a UI list, etc. knowing the index.
      console.log(`A task was deleted at the ${index} index`)
    })
    // Update UI in response to inserted objects
    changes.insertions.forEach(index => {
      let insertedTasks = collection[index]
      console.log(`insertedTasks: ${JSON.stringify(insertedTasks, null, 2)}`)
      // ...
    })
    // Update UI in response to modified objects
    // `newModifications` contains object indexes from after they were modified
    changes.newModifications.forEach(index => {
      let modifiedTask = collection[index]
      console.log(`modifiedTask: ${JSON.stringify(modifiedTask, null, 2)}`)
      // ...
    })
  }
  // Observe collection notifications.
  tasks.addListener(listener)

  realm.write(() => {
    if (!task1) {
      return
    }
    task1.status = 'InProgress'
  })

  realm.write(() => {
    if (!task1) {
      return
    }
    // Delete the task from the realm.
    realm.delete(task1)
    // Discard the reference.
    task1 = null
  })

  // Remember to close the realm
  realm.close()
}
