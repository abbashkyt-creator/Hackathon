const UI = {
  ru: {
    level: 'Ур', rain: 'Дождик', snow: 'Снежок', lightning: 'Молния', sound: 'Звук',
    quests: 'Задания', save: 'Сохранить', pause: 'Пауза', clear: 'Очистить',
    brush: 'Кисть', eraser: 'Ластик',
    slot: 'Слот', empty: 'Пусто', locked: 'Закрыто',
    unlock: 'Открыть', saveBtn: 'Сохр.', loadBtn: 'Загр.',
    saveTitle: 'Мои миры', close: 'Закрыть', loading: 'Загрузка...',
    watch: 'Смотреть', cancel: 'Отмена',
    unlockDesc: 'Посмотри короткое видео и получи этот элемент навсегда!',
    questsDone: 'Все задания выполнены!',
    hintClick: 'Кликай, чтобы создать волшебство',
    hintTap: 'Тапай, чтобы создать волшебство'
  },
  en: {
    level: 'Lv', rain: 'Rain', snow: 'Snow', lightning: 'Lightning', sound: 'Sound',
    quests: 'Quests', save: 'Save', pause: 'Pause', clear: 'Clear',
    brush: 'Brush', eraser: 'Eraser',
    slot: 'Slot', empty: 'Empty', locked: 'Locked',
    unlock: 'Unlock', saveBtn: 'Save', loadBtn: 'Load',
    saveTitle: 'My Worlds', close: 'Close', loading: 'Loading...',
    watch: 'Watch', cancel: 'Cancel',
    unlockDesc: 'Watch a short video to unlock this element forever!',
    questsDone: 'All quests completed!',
    hintClick: 'Click to make some magic',
    hintTap: 'Tap to make some magic'
  }
};

let currentLang = 'ru';

export function setLang(lang) {
  currentLang = UI[lang] ? lang : 'en';
}

export function getLang() { return currentLang; }

export function t(key) {
  const dict = UI[currentLang] || UI.en;
  return dict[key] || UI.en[key] || key;
}
