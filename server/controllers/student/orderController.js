import paypal from '../../helper/paypal.js'
import Order from '../../models/Order.js'
import Course from '../../models/Course.js'
import StudentCourses from '../../models/StudentCourses.js'

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      username,
      email,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body

    const vndPrice = Number(coursePricing)

    if (vndPrice === 0) {
      const freeOrder = new Order({
        userId,
        username,
        email,
        orderStatus: 'completed',
        paymentMethod: 'free',
        paymentStatus: 'success',
        orderDate: new Date(),
        paymentId: 'FREE_ORDER',
        payerId: 'FREE_USER',
        instructorId,
        instructorName,
        courseImage,
        courseTitle,
        courseId,
        coursePricing,
      })

      await freeOrder.save()

      const courseData = {
        courseId: courseId,
        title: courseTitle,
        instructorId: instructorId,
        instructorName: instructorName,
        dateOfPurchase: new Date(),
        courseImage: courseImage,
      }

      const studentCourses = await StudentCourses.findOne({
        userId: userId,
      })

      if (studentCourses) {
        const alreadyBought = studentCourses.courses.some(
          (course) => course.courseId.toString() === courseId.toString()
        )

        if (!alreadyBought) {
          studentCourses.courses.push(courseData)
          await studentCourses.save()
        }
      } else {
        const newStudentCourses = new StudentCourses({
          userId: userId,
          courses: [courseData],
        })

        await newStudentCourses.save()
      }

      await Course.findByIdAndUpdate(courseId, {
        $addToSet: {
          students: {
            studentId: userId,
            studentName: username,
            studentEmail: email,
            paidAmount: vndPrice,
          },
        },
      })

      return res.status(201).json({
        success: true,
        data: {
          isFree: true,
          orderId: freeOrder._id,
        },
      })
    }

    const exchangeRate = 25000
    const usdPrice = (vndPrice / exchangeRate).toFixed(2).toString()

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/payment-return`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: courseTitle
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, ''),
                sku: courseId,
                price: usdPrice,
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: usdPrice,
          },
          description: `${courseTitle} (Giá gốc: ${vndPrice.toLocaleString()}₫)`,
        },
      ],
    }

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error('PayPal error:', JSON.stringify(error.response, null, 2))
        return res.status(500).json({
          success: false,
          message: 'Error while creating paypal payment!',
        })
      } else {
        const order = new Order({
          userId,
          username,
          email,
          orderStatus,
          paymentMethod,
          paymentStatus,
          orderDate,
          paymentId,
          payerId,
          instructorId,
          instructorName,
          courseImage,
          courseTitle,
          courseId,
          coursePricing,
        })

        await order.save()

        const approveUrl = paymentInfo.links.find(
          (link) => link.rel === 'approval_url'
        ).href

        res.status(201).json({
          success: true,
          data: {
            approveUrl,
            orderId: order._id,
          },
        })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: 'Some error occurred!',
    })
  }
}

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body

    let order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order cannot be found',
      })
    }

    if (order.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Order already confirmed',
        data: order,
      })
    }

    order.paymentStatus = 'paid'
    order.orderStatus = 'confirmed'
    order.paymentId = paymentId || 'free-course'
    order.payerId = payerId || 'free-user'

    console.log(order)

    await order.save()

    const courseData = {
      courseId: order.courseId,
      title: order.courseTitle,
      instructorId: order.instructorId,
      instructorName: order.instructorName,
      dateOfPurchase: order.orderDate,
      courseImage: order.courseImage,
    }

    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    })

    if (studentCourses) {
      const alreadyBought = studentCourses.courses.some(
        (course) => course.courseId.toString() === order.courseId.toString()
      )

      if (!alreadyBought) {
        studentCourses.courses.push(courseData)
        await studentCourses.save()
      }
    } else {
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [courseData],
      })

      await newStudentCourses.save()
    }

    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.username,
          studentEmail: order.email,
          paidAmount: order.coursePricing,
        },
      },
    })

    res.status(200).json({
      success: true,
      message: 'Order confirmed',
      data: order,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      success: false,
      message: 'Some error occurred!',
    })
  }
}

export { createOrder, capturePaymentAndFinalizeOrder }
