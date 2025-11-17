interface Entity {
  id: string
}



type Timestamped = {
  createdDate: Date,
  updatedDate: Date
}


type Model = Entity & Timestamped & {
  data: any
}


interface User extends Model {
    name: string
}

/*const user: User = {
    id: "1",
    createdDate: new Date(),
    updatedDate: new Date(),
    name: "Alice"
}*/