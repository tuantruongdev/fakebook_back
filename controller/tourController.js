/* eslint-disable prefer-object-spread */
const catchAsync = require("../utils/catchAsync");
const Tour = require("../models/tourModel");

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };

    //remove unwated object
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    //convertQueryobject to mongo queries
    let querystr = JSON.stringify(queryObj);
    querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(querystr));
    return this;
  }

  sortBy() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query.sort(sortBy);
    } else {
      this.query.sort("-createdAt");
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const sortBy = this.queryString.fields.split(",").join(" ");
      this.query.select(sortBy);
    } else {
      this.query.select("-__v");
    }
    return this;
  }

  paging() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //limit
    this.query.skip(skip).limit(limit);
    return this;
  }
}

exports.getAllTour = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .fields()
    .sortBy()
    .paging();
  const tours = await features.query;
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours: tours },
  });
});
exports.addNewTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});
exports.getTour = catchAsync(
  async (req, res) => {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",

      data: { tour },
    });
  }

  // const id = req.params.id * 1;
  // const findTour = tours.find((item) => item.id === id);
  // res.status(200).json({
  //   status: "success",
  //   data: { findTour },
  // });
);
exports.updateTour = catchAsync(async (req, res) => {
  const editTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      editTour,
    },
  });
});
exports.deleteTour = catchAsync(async (req, res) => {
  const editTour = await Tour.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      editTour,
    },
  });
});
