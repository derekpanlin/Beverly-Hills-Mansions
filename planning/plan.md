Table Spots {
  id int [pk]
  owner_id int [ref: > Users.id]
  address varchar
  city varchar
  state varchar
  country varchar
  lat decimal(10, 7)
  lng decimal(10, 7)
  name varchar
  description varchar
  price int
  created_at datetime [default: `CURRENT_TIMESTAMP`]
  updated_at datetime [default: `CURRENT_TIMESTAMP`]
}

Table Users {
  id int [pk]
  first_name varchar
  last_name varchar
  email varchar
  username varchar
  password varchar
  created_at datetime [default: `CURRENT_TIMESTAMP`]
  updated_at datetime [default: `CURRENT_TIMESTAMP`]
}

table Reviews {
  id int [pk]
  user_id int [ref: > Users.id]
  spot_id int [ref: > Spots.id]
  review varchar
  stars int
  created_at datetime [default: `CURRENT_TIMESTAMP`]
  updated_at datetime [default: `CURRENT_TIMESTAMP`]
}

table Bookings {
  id int [pk]
  user_id int [ref: > Users.id]
  spot_id int [ref: > Spots.id]
  start_date date
  end_date date
  created_at datetime [default: `CURRENT_TIMESTAMP`]
  updated_at datetime [default: `CURRENT_TIMESTAMP`]
}

table Images {
  id int [pk]
  url varchar
  spot_id int [ref: > Spots.id]
  review_id int [ref: > Reviews.id]
}
