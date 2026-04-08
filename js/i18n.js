const LANG_KEY = 'ng_lang';
const LANGS = ['en', 'ru', 'uz', 'kk'];
const LANG_LABELS = { en: 'EN', ru: 'RU', uz: 'UZ', kk: 'KZ' };
const LANG_NAMES = { en: 'English', ru: 'Русский', uz: "O'zbek", kk: 'Қазақ' };

let currentLang = localStorage.getItem(LANG_KEY) || 'ru';
const listeners = [];

const translations = {
  en: {
    // Nav
    'nav.title': 'NOCTURNAL GALLERY',
    'nav.waiter': 'Waiter',
    'nav.menu': 'Menu',
    'nav.search': 'Search',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',

    // Home
    'home.selected': 'Selected for you',
    'home.specials': "Today's Specials",
    'home.explore': 'Explore the Gallery',
    'home.kitchen': 'Kitchen',
    'home.kitchen_desc': 'Artisanal textures and refined aromas from our flame.',
    'home.open_menu': 'Open Menu',
    'home.bar': 'Bar',
    'home.bar_sub': 'Mixology',
    'home.hookah': 'Hookah',
    'home.hookah_sub': 'Experiences',
    'home.signature': 'Signature Dish',

    // Menu
    'menu.popular': 'Popular',
    'menu.new': 'New',
    'menu.healthy': 'Healthy',
    'menu.specials': "Chef's Specials",
    'menu.empty': 'No dishes in this category yet.',
    'menu.add': 'Add to Order',
    'menu.added': 'Added!',

    // Dish
    'dish.not_found': 'Dish not found.',
    'dish.calories': 'Calories',
    'dish.proteins': 'Proteins',
    'dish.carbs': 'Carbs',
    'dish.kcal': 'kcal',
    'dish.grams': 'g',
    'dish.ingredients': 'Main Ingredients',
    'dish.reviews': 'Guest Reviews',
    'dish.reviews_count': 'review|reviews',
    'dish.leave_review': 'Leave a Review',
    'dish.no_reviews': 'No reviews yet. Be the first!',
    'dish.total_price': 'Total Price',
    'dish.add_to_cart': 'Add to Cart',

    // Review modal
    'review.title': 'Leave a Review',
    'review.tap_rate': 'Tap to rate',
    'review.your_name': 'Your Name',
    'review.guest': 'Guest',
    'review.your_review': 'Your Review',
    'review.placeholder': 'Share your experience...',
    'review.offline': 'Firebase not configured — review will be saved locally only',
    'review.submit': 'Submit Review',
    'review.submitting': 'Submitting...',
    'review.poor': 'Poor',
    'review.fair': 'Fair',
    'review.good': 'Good',
    'review.great': 'Great',
    'review.excellent': 'Excellent',

    // Time
    'time.just_now': 'Just now',
    'time.min_ago': 'm ago',
    'time.hour_ago': 'h ago',
    'time.day_ago': 'd ago',

    // Cart
    'cart.empty_title': 'Your cart is empty',
    'cart.empty_desc': 'Start exploring our menu to add items.',
    'cart.browse': 'Browse Menu',
    'cart.selection': 'Your Selection',
    'cart.selection_sub': 'The art of a perfect evening.',
    'cart.split': 'Split the Bill',
    'cart.split_desc': 'Share the meal between guests.',
    'cart.equally': 'Equally',
    'cart.by_items': 'By Items',
    'cart.custom': 'Custom',
    'cart.guests': 'Guests',
    'cart.selected': 'Selected',
    'cart.each_pays': 'Each pays',
    'cart.subtotal': 'Subtotal',
    'cart.tax': 'Tax & Service',
    'cart.total': 'Total',
    'cart.proceed': 'Proceed to Payment',

    // Payment
    'pay.secure': 'Secure Payment',
    'pay.order': 'Order Details',
    'pay.subtotal': 'Subtotal',
    'pay.tips': 'Tips',
    'pay.support': 'Support the team',
    'pay.no_tip': 'No Tip',
    'pay.method': 'Payment Method',
    'pay.apple': 'Apple Pay',
    'pay.card': 'Visa *4242',
    'pay.card_exp': 'Expires 12/26',
    'pay.cash': 'Cash Payment',
    'pay.total_amount': 'Total Amount to Pay',
    'pay.including': 'Including {tip}% tips and {tax}% service tax.',
    'pay.now': 'PAY NOW',
    'pay.encrypted': 'Encrypted transaction via Nocturnal Secure-Gate',
    'pay.success': 'Payment Successful',
    'pay.success_desc': 'Your transaction is complete. A digital receipt has been sent to your registered email.',
    'pay.transaction_id': 'Transaction ID',
    'pay.time': 'Time',
    'pay.return': 'Return to Gallery',

    // Format
    'fmt.sum': 'sum',

    // Placeholder pages
    'app.coming_soon': 'Coming soon',
  },

  ru: {
    'nav.title': 'NOCTURNAL GALLERY',
    'nav.waiter': 'Официант',
    'nav.menu': 'Меню',
    'nav.search': 'Поиск',
    'nav.cart': 'Корзина',
    'nav.profile': 'Профиль',

    'home.selected': 'Выбрано для вас',
    'home.specials': 'Специальное предложение',
    'home.explore': 'Исследуйте галерею',
    'home.kitchen': 'Кухня',
    'home.kitchen_desc': 'Изысканные текстуры и утончённые ароматы из нашей печи.',
    'home.open_menu': 'Открыть меню',
    'home.bar': 'Бар',
    'home.bar_sub': 'Миксология',
    'home.hookah': 'Кальян',
    'home.hookah_sub': 'Впечатления',
    'home.signature': 'Фирменное блюдо',

    'menu.popular': 'Популярное',
    'menu.new': 'Новинки',
    'menu.healthy': 'Здоровое',
    'menu.specials': 'От шефа',
    'menu.empty': 'В этой категории пока нет блюд.',
    'menu.add': 'Добавить',
    'menu.added': 'Добавлено!',

    'dish.not_found': 'Блюдо не найдено.',
    'dish.calories': 'Калории',
    'dish.proteins': 'Белки',
    'dish.carbs': 'Углеводы',
    'dish.kcal': 'ккал',
    'dish.grams': 'г',
    'dish.ingredients': 'Основные ингредиенты',
    'dish.reviews': 'Отзывы гостей',
    'dish.reviews_count': 'отзыв|отзыва|отзывов',
    'dish.leave_review': 'Оставить отзыв',
    'dish.no_reviews': 'Пока нет отзывов. Будьте первым!',
    'dish.total_price': 'Итого',
    'dish.add_to_cart': 'В корзину',

    'review.title': 'Оставить отзыв',
    'review.tap_rate': 'Нажмите для оценки',
    'review.your_name': 'Ваше имя',
    'review.guest': 'Гость',
    'review.your_review': 'Ваш отзыв',
    'review.placeholder': 'Поделитесь впечатлениями...',
    'review.offline': 'Firebase не настроен — отзыв сохранится только локально',
    'review.submit': 'Отправить',
    'review.submitting': 'Отправка...',
    'review.poor': 'Плохо',
    'review.fair': 'Так себе',
    'review.good': 'Хорошо',
    'review.great': 'Отлично',
    'review.excellent': 'Превосходно',

    'time.just_now': 'Только что',
    'time.min_ago': 'мин назад',
    'time.hour_ago': 'ч назад',
    'time.day_ago': 'д назад',

    'cart.empty_title': 'Корзина пуста',
    'cart.empty_desc': 'Начните изучать меню, чтобы добавить блюда.',
    'cart.browse': 'Смотреть меню',
    'cart.selection': 'Ваш выбор',
    'cart.selection_sub': 'Искусство идеального вечера.',
    'cart.split': 'Разделить счёт',
    'cart.split_desc': 'Разделите счёт между гостями.',
    'cart.equally': 'Поровну',
    'cart.by_items': 'По блюдам',
    'cart.custom': 'Свой',
    'cart.guests': 'Гости',
    'cart.selected': 'Выбрано',
    'cart.each_pays': 'Каждый платит',
    'cart.subtotal': 'Подытог',
    'cart.tax': 'Налог и сервис',
    'cart.total': 'Итого',
    'cart.proceed': 'Перейти к оплате',

    'pay.secure': 'Безопасная оплата',
    'pay.order': 'Детали заказа',
    'pay.subtotal': 'Подытог',
    'pay.tips': 'Чаевые',
    'pay.support': 'Поддержите команду',
    'pay.no_tip': 'Без чаевых',
    'pay.method': 'Способ оплаты',
    'pay.apple': 'Apple Pay',
    'pay.card': 'Visa *4242',
    'pay.card_exp': 'До 12/26',
    'pay.cash': 'Наличные',
    'pay.total_amount': 'Сумма к оплате',
    'pay.including': 'Включая {tip}% чаевых и {tax}% сервисного сбора.',
    'pay.now': 'ОПЛАТИТЬ',
    'pay.encrypted': 'Зашифрованная транзакция через Nocturnal Secure-Gate',
    'pay.success': 'Оплата прошла успешно',
    'pay.success_desc': 'Транзакция завершена. Электронный чек отправлен на ваш email.',
    'pay.transaction_id': 'ID транзакции',
    'pay.time': 'Время',
    'pay.return': 'Вернуться в меню',

    'fmt.sum': 'сум',
    'app.coming_soon': 'Скоро',
  },

  uz: {
    'nav.title': 'NOCTURNAL GALLERY',
    'nav.waiter': 'Ofitsiant',
    'nav.menu': 'Menyu',
    'nav.search': 'Qidirish',
    'nav.cart': 'Savat',
    'nav.profile': 'Profil',

    'home.selected': 'Siz uchun tanlangan',
    'home.specials': 'Bugungi maxsus taklif',
    'home.explore': 'Galereyani kashf qiling',
    'home.kitchen': 'Oshxona',
    'home.kitchen_desc': "Olovimizdan keladigan noyob ta'm va xushbo'y hidlar.",
    'home.open_menu': 'Menyuni ochish',
    'home.bar': 'Bar',
    'home.bar_sub': 'Miksologiya',
    'home.hookah': 'Qalyon',
    'home.hookah_sub': 'Tajribalar',
    'home.signature': 'Firmaviy taom',

    'menu.popular': 'Mashhur',
    'menu.new': 'Yangi',
    'menu.healthy': 'Foydali',
    'menu.specials': 'Shef-povardан',
    'menu.empty': 'Bu kategoriyada hali taomlar yo\'q.',
    'menu.add': 'Qo\'shish',
    'menu.added': 'Qo\'shildi!',

    'dish.not_found': 'Taom topilmadi.',
    'dish.calories': 'Kaloriya',
    'dish.proteins': 'Oqsillar',
    'dish.carbs': 'Uglevodlar',
    'dish.kcal': 'kkal',
    'dish.grams': 'g',
    'dish.ingredients': 'Asosiy ingredientlar',
    'dish.reviews': 'Mehmonlar sharhlari',
    'dish.reviews_count': 'sharh|sharh|sharh',
    'dish.leave_review': 'Sharh qoldirish',
    'dish.no_reviews': 'Hali sharhlar yo\'q. Birinchi bo\'ling!',
    'dish.total_price': 'Jami narx',
    'dish.add_to_cart': 'Savatga',

    'review.title': 'Sharh qoldirish',
    'review.tap_rate': 'Baholash uchun bosing',
    'review.your_name': 'Ismingiz',
    'review.guest': 'Mehmon',
    'review.your_review': 'Sharhingiz',
    'review.placeholder': 'Tajribangizni baham ko\'ring...',
    'review.offline': 'Firebase sozlanmagan — sharh faqat lokal saqlanadi',
    'review.submit': 'Yuborish',
    'review.submitting': 'Yuborilmoqda...',
    'review.poor': 'Yomon',
    'review.fair': 'O\'rtacha',
    'review.good': 'Yaxshi',
    'review.great': 'Ajoyib',
    'review.excellent': 'Zo\'r',

    'time.just_now': 'Hozirgina',
    'time.min_ago': 'daq oldin',
    'time.hour_ago': 'soat oldin',
    'time.day_ago': 'kun oldin',

    'cart.empty_title': 'Savat bo\'sh',
    'cart.empty_desc': 'Taom qo\'shish uchun menyuni ko\'ring.',
    'cart.browse': 'Menyuni ko\'rish',
    'cart.selection': 'Sizning tanlovingiz',
    'cart.selection_sub': 'Mukammal kechaning san\'ati.',
    'cart.split': 'Hisobni bo\'lish',
    'cart.split_desc': 'Hisobni mehmonlar orasida bo\'ling.',
    'cart.equally': 'Teng',
    'cart.by_items': 'Taomlarga',
    'cart.custom': 'Boshqa',
    'cart.guests': 'Mehmonlar',
    'cart.selected': 'Tanlangan',
    'cart.each_pays': 'Har biri to\'laydi',
    'cart.subtotal': 'Oraliq jami',
    'cart.tax': 'Soliq va xizmat',
    'cart.total': 'Jami',
    'cart.proceed': 'To\'lovga o\'tish',

    'pay.secure': 'Xavfsiz to\'lov',
    'pay.order': 'Buyurtma tafsilotlari',
    'pay.subtotal': 'Oraliq jami',
    'pay.tips': 'Choy puli',
    'pay.support': 'Jamoani qo\'llab-quvvatlang',
    'pay.no_tip': 'Choy pulsiz',
    'pay.method': 'To\'lov usuli',
    'pay.apple': 'Apple Pay',
    'pay.card': 'Visa *4242',
    'pay.card_exp': 'Amal qilish 12/26',
    'pay.cash': 'Naqd pul',
    'pay.total_amount': 'To\'lov summasi',
    'pay.including': '{tip}% choy puli va {tax}% xizmat solig\'i kiritilgan.',
    'pay.now': 'TO\'LASH',
    'pay.encrypted': 'Nocturnal Secure-Gate orqali shifrlangan tranzaksiya',
    'pay.success': 'To\'lov muvaffaqiyatli',
    'pay.success_desc': 'Tranzaksiya yakunlandi. Elektron kvitansiya emailingizga yuborildi.',
    'pay.transaction_id': 'Tranzaksiya ID',
    'pay.time': 'Vaqt',
    'pay.return': 'Menyuga qaytish',

    'fmt.sum': 'so\'m',
    'app.coming_soon': 'Tez kunda',
  },

  kk: {
    'nav.title': 'NOCTURNAL GALLERY',
    'nav.waiter': 'Даяшы',
    'nav.menu': 'Мәзір',
    'nav.search': 'Іздеу',
    'nav.cart': 'Себет',
    'nav.profile': 'Профиль',

    'home.selected': 'Сіз үшін таңдалды',
    'home.specials': 'Бүгінгі арнайы ұсыныс',
    'home.explore': 'Галереяны зерттеңіз',
    'home.kitchen': 'Ас үй',
    'home.kitchen_desc': 'Біздің отымыздан келетін нәзік дәм мен хош иіс.',
    'home.open_menu': 'Мәзірді ашу',
    'home.bar': 'Бар',
    'home.bar_sub': 'Миксология',
    'home.hookah': 'Кальян',
    'home.hookah_sub': 'Тәжірибелер',
    'home.signature': 'Фирмалық тағам',

    'menu.popular': 'Танымал',
    'menu.new': 'Жаңа',
    'menu.healthy': 'Пайдалы',
    'menu.specials': 'Шеф-повардан',
    'menu.empty': 'Бұл санатта әлі тағамдар жоқ.',
    'menu.add': 'Қосу',
    'menu.added': 'Қосылды!',

    'dish.not_found': 'Тағам табылмады.',
    'dish.calories': 'Калория',
    'dish.proteins': 'Ақуыздар',
    'dish.carbs': 'Көмірсулар',
    'dish.kcal': 'ккал',
    'dish.grams': 'г',
    'dish.ingredients': 'Негізгі ингредиенттер',
    'dish.reviews': 'Қонақтар пікірлері',
    'dish.reviews_count': 'пікір|пікір|пікір',
    'dish.leave_review': 'Пікір қалдыру',
    'dish.no_reviews': 'Әлі пікірлер жоқ. Бірінші болыңыз!',
    'dish.total_price': 'Жалпы баға',
    'dish.add_to_cart': 'Себетке',

    'review.title': 'Пікір қалдыру',
    'review.tap_rate': 'Бағалау үшін басыңыз',
    'review.your_name': 'Атыңыз',
    'review.guest': 'Қонақ',
    'review.your_review': 'Пікіріңіз',
    'review.placeholder': 'Тәжірибеңізбен бөлісіңіз...',
    'review.offline': 'Firebase баптаудан — пікір тек жергілікті сақталады',
    'review.submit': 'Жіберу',
    'review.submitting': 'Жіберілуде...',
    'review.poor': 'Нашар',
    'review.fair': 'Орташа',
    'review.good': 'Жақсы',
    'review.great': 'Тамаша',
    'review.excellent': 'Керемет',

    'time.just_now': 'Дәл қазір',
    'time.min_ago': 'мин бұрын',
    'time.hour_ago': 'сағ бұрын',
    'time.day_ago': 'күн бұрын',

    'cart.empty_title': 'Себет бос',
    'cart.empty_desc': 'Тағам қосу үшін мәзірді қараңыз.',
    'cart.browse': 'Мәзірді қарау',
    'cart.selection': 'Сіздің таңдауыңыз',
    'cart.selection_sub': 'Мінсіз кештің өнері.',
    'cart.split': 'Шотты бөлу',
    'cart.split_desc': 'Шотты қонақтар арасында бөліңіз.',
    'cart.equally': 'Тең',
    'cart.by_items': 'Тағамдар',
    'cart.custom': 'Басқа',
    'cart.guests': 'Қонақтар',
    'cart.selected': 'Таңдалды',
    'cart.each_pays': 'Әрқайсысы төлейді',
    'cart.subtotal': 'Аралық сома',
    'cart.tax': 'Салық және қызмет',
    'cart.total': 'Жалпы',
    'cart.proceed': 'Төлемге өту',

    'pay.secure': 'Қауіпсіз төлем',
    'pay.order': 'Тапсырыс мәліметтері',
    'pay.subtotal': 'Аралық сома',
    'pay.tips': 'Шай ақы',
    'pay.support': 'Команданы қолдаңыз',
    'pay.no_tip': 'Шай ақысыз',
    'pay.method': 'Төлем әдісі',
    'pay.apple': 'Apple Pay',
    'pay.card': 'Visa *4242',
    'pay.card_exp': 'Мерзімі 12/26',
    'pay.cash': 'Қолма-қол ақша',
    'pay.total_amount': 'Төлем сомасы',
    'pay.including': '{tip}% шай ақы және {tax}% қызмет салығы кіреді.',
    'pay.now': 'ТӨЛЕУ',
    'pay.encrypted': 'Nocturnal Secure-Gate арқылы шифрланған транзакция',
    'pay.success': 'Төлем сәтті өтті',
    'pay.success_desc': 'Транзакция аяқталды. Электронды квитанция emailіңізге жіберілді.',
    'pay.transaction_id': 'Транзакция ID',
    'pay.time': 'Уақыт',
    'pay.return': 'Мәзірге оралу',

    'fmt.sum': 'сум',
    'app.coming_soon': 'Жақында',
  }
};

export function t(key, params) {
  const str = translations[currentLang]?.[key] || translations.en[key] || key;
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? '');
}

export function tPlural(key, count) {
  const forms = t(key).split('|');
  if (currentLang === 'en') return count === 1 ? forms[0] : forms[1] || forms[0];
  // Slavic pluralization (ru/kk): 1 review, 2-4 reviewа, 5+ reviewов
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1] || forms[0];
  return forms[2] || forms[1] || forms[0];
}

export function getLang() { return currentLang; }
export function getLangs() { return LANGS; }
export function getLangLabel(code) { return LANG_LABELS[code]; }
export function getLangName(code) { return LANG_NAMES[code]; }

export function setLang(code) {
  if (!LANGS.includes(code)) return;
  currentLang = code;
  localStorage.setItem(LANG_KEY, code);
  listeners.forEach(fn => fn(code));
}

export function onLangChange(fn) {
  listeners.push(fn);
}

// Helper: get translated dish field (name/description/ingredients)
export function tDish(dish, field) {
  if (currentLang === 'en' || !dish._t || !dish._t[currentLang]) return dish[field];
  return dish._t[currentLang][field] || dish[field];
}