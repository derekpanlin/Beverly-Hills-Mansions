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
  price decimal
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
}

Table Users {
  id int [pk]
  first_name varchar
  last_name varchar
  email varchar
  username varchar
  hashed_password varchar
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
}

table Reviews {
  id int [pk]
  user_id int [ref: > Users.id]
  spot_id int [ref: > Spots.id]
  review varchar
  stars int
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
}

table Bookings {
  id int [pk]
  user_id int [ref: > Users.id]
  spot_id int [ref: > Spots.id]
  start_date date
  end_date date
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
}

table SpotImages {
  id int [pk]
  url varchar
  preview boolean
  spot_id int [ref: > Spots.id]
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
}

table ReviewImages {
  id int [pk]
  url varchar
  review_id int [ref: > Reviews.id]
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
}

![alt text](<../images/Airbnb Project  (2).jpg>)
