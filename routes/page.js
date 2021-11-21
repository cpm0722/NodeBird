const express = require('express');
const { User, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followerIdList = [];
  next();
});

router.get('/hashtag', async (req, res, next) => {
	const query = req.query.hashtag;
	if (!query) {
		return res.redirect('/');
	}
	try {
		const hashtag = await Hashtag.findOne({ where: { title: query } });
		let posts = [];
		if (hashtag) {
			posts = await hashtag.getPosts({ include: [{ model: User }] });
		}

		return res.render('main', {
			title: `${query} | NodeBird`,
			twits: posts,
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
});

router.get('/profile', isLoggedIn,  (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => {
  const twits = [];
  res.render('main', {
    title: 'NodeBird',
    twits,
  });
});

module.exports = router;
