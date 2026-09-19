import { useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  Sun,
  Gauge,
  Droplets,
  Wind,
  CloudLightning,
  Thermometer,
  FlaskConical,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  Library,
  CalendarDays,
  X,
  ZoomIn,
  Menu } from
'lucide-react';

import sunHeatingDiagram from '@/assets/uploads/sun-heating-atmosphere-diagram.png';
import greenhouseEffectDiagram from '@/assets/uploads/greenhouse-effect-diagram.png';
import thermometerDiagram from '@/assets/uploads/thermometer-measurement-diagram.png';
import airPressureDiagram from '@/assets/uploads/air-pressure-wind-diagram.png';
import airPressureAltitudeDiagram from '@/assets/uploads/air-pressure-altitude-ear-diagram.png';
import pressureSystemsDiagram from '@/assets/uploads/pressure-systems-hebrew-diagram.png';
import barometerDiagram from '@/assets/uploads/barometer-diagram.png';
import weatherProfessionsCollage from '@/assets/uploads/weather-professions-collage.jpg';
import weatherForecastTV from '@/assets/uploads/weather-forecast-tv-israel.jpg';
import sunAtmosphereHeatingDiagram from '@/assets/uploads/sun-atmosphere-heating-diagram.jpg';
import humiditySourceDiagram from '@/assets/uploads/humidity-source-diagram.png';
import waterStatesDiagram from '@/assets/uploads/water-states-diagram.png';
import waterCycleDiagram from '@/assets/uploads/water-cycle-diagram.png';
import relativeHumidityDiagram from '@/assets/uploads/relative-humidity-diagram.png';
import condensationDiagram from '@/assets/uploads/condensation-diagram.png';
import cloudFormationDiagram from '@/assets/uploads/cloud-formation-diagram.png';
import cloudCoverageScaleDiagram from '@/assets/uploads/cloud-coverage-scale-diagram.png';

interface Chapter {
  id: string;
  number: number | string;
  title: string;
  icon: React.ReactNode;
  sections: Section[];
}

interface Section {
  title: string;
  content: string;
  image?: string;
  imageAlt?: string;
  note?: string;
}

const chapters: Chapter[] = [
{
  id: 'home-page',
  number: '',
  title: 'דף ראשי',
  icon: <Library className="w-5 h-5" />,
  sections: [
  {
    title: 'ברוכים הבאים לאנציקלופדיית מזג אויר לכל',
    content: `אנציקלופדיה זו נועדה להסביר את עולם מזג אויר השונות, כיצד הן נוצרות ומדוע הן חשובות לחיינו.`,
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80',
    imageAlt: 'שמים דרמטיים עם עננים צבעוניים',
    note: 'התמונות והאיורים המוצגים באנציקלופדיה נוצרו על ידי AI. יתכנו שגיאות'
  },
  {
    title: 'יעוץ מדעי ועריכת החומר',
    content: `אבי יעקבי, חזאי מטאורולוגי`
  },
  {
    title: 'תוכן האנציקלופדיה',
    content: `מבוא

1. השמש והטמפרטורה
2. לחץ אויר
3. לחות האויר עננים ומשקעים
4. גושי אויר וחזיתות
5. רוחות
6. תופעות מזג אויר חמורות
7. תנאי מזג אויר קיצוניים
8. גשם חומצי
9. עונות השנה`
  }]

},
{
  id: 'intro',
  number: 0,
  title: 'מבוא',
  icon: <BookOpen className="w-5 h-5" />,
  sections: [
  {
    title: 'מדוע חשוב ללמוד על מזג האויר?',
    content: `מזג האויר הוא עניין שבחדשות. מידי יום, מיליוני אנשים צופים בתחזית מזג האויר בטלוויזיה, מאזין לה ברדיו וקוראים אותה בעיתונות ובאינטרנט. בצורות, הוריקנים ושטפונות, כולם מדוברים בחדשות.`,
    image: weatherForecastTV,
    imageAlt: 'תחזית מזג אויר בטלוויזיה הישראלית - חדשות 12'
  },
  {
    title: 'מדוע מופיע מזג האויר בחדשות?',
    content: `מזג האויר משפיע על בריאותנו. חשוב לנו לדעת כמה חם או קר בחוץ, או אם ירד מחר גשם, כדי לדעת מה ללבוש. אנשים רבים, כגון: חקלאים, טייסים, מלחים, בנאים וספורטאים, מגלים עניין רב במזג האויר.`,
    image: weatherProfessionsCollage,
    imageAlt: 'מקצועות שמושפעים ממזג האוויר - חקלאי, עובד בנייה, דייג, טייס וספורטאים'
  },
  {
    title: 'מהי מטאורולוגיה?',
    content: `מטאורולוגיה היא מדע שעוסק בכל הקשור לשינויים באטמוספרה. האטמוספרה היא שכבת האויר שמקיף אותנו. לשינויים באטמוספרה חשיבות רבה בחיזוי מזג אויר. מטאורולוגיה היא מדע המטאורולוגיה. חזאי הוא מטאורולוג שעוסק בחיזוי מזג אויר.`,
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    imageAlt: 'כדור הארץ מהחלל - האטמוספרה עוטפת את כדור הארץ'
  },
  {
    title: 'מהו מזג אויר?',
    content: `ארבעת הדברים שגורמים למזג אויר הם: השמש, האטמוספרה, אדי מים ורוח. כל אלה פועלים יחד; הם מפזרים את חום השמש סביב העולם ויוצרים עננים, גשם ושלג. מזג האויר הוא מחזור אינסופי של תופעות.`
  },
  {
    title: 'היכן מתרחש מזג האוויר?',
    content: `האטמוספרה היא כמו שמיכה ענקית של אויר, שעוטפת את כדור הארץ. היא מחולקת לשכבות. מזג האוויר מתרחש בשכבה הנמוכה ביותר, הנקראת טרופוספרה ושנמצאת ממש מעל האדמה.`,
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80',
    imageAlt: 'שכבות עננים בשמים - הטרופוספרה'
  },
  {
    title: 'מהם חמשת היסודות של מזג האויר?',
    content: `1. טמפרטורה\n2. לחץ אויר\n3. לחות\n4. משקעים (גשם, שלג וברד)\n5. רוח`
  }]

},
{
  id: 'sun-temperature',
  number: 1,
  title: 'השמש והטמפרטורה',
  icon: <Sun className="w-5 h-5" />,
  sections: [
  {
    title: 'מהו תפקידה של השמש?',
    content: `השמש היא מקור האור והחום של כדור הארץ (אור+חום=אנרגיה). כמות האור והחום, שמגיעה מהשמש לכדור הארץ במשך דקה, גדולה יותר מכמות האנרגיה שכל האנשים בעולם יכולים לייצר במשך שנה שלמה.\n\nהשמש שומרת על טמפרטורה בין מינוס 51 ל 49 מעלות צלזיוס ברוב כדור הארץ.`,
    image: 'https://images.unsplash.com/photo-1575881875475-31023242e3f9?w=800&q=80',
    imageAlt: 'השמש זורחת - מקור האנרגיה של כדור הארץ'
  },
  {
    title: 'כיצד משפיעה השמש על מזג האויר?',
    content: `קרני השמש עוברות באטמוספרה, כמו במסננת, ומחממות את האדמה. האדמה מתחממת ומחממת את האויר מעליה. החום גורם לתנועה באויר בגלל שאויר חם עולה.\n\nקו המשווה הוא חם בגלל שהשמש זורחת ממש מעליו. הקטבים קרים בגלל שקרני השמש פוגעות בהם בזווית נמוכה יותר.`,
    image: sunAtmosphereHeatingDiagram,
    imageAlt: 'תהליך ההתחממות וההסעה באטמוספרה - כיצד קרני השמש מחממות את כדור הארץ'
  },
  {
    title: 'כיצד שומר כדור הארץ על חומו?',
    content: `האדמה סופגת אור שמש ומשחררת אותו לאויר בצורה של חום. אדי מים ועננים כולאים את החום ומחזירים אותו אל האדמה. האטמוספרה היא כמו שמיכה ענקית מסביב לכדור הארץ, ששומרת על החום בו.`,
    image: greenhouseEffectDiagram,
    imageAlt: 'תרשים אפקט החממה - כיצד האטמוספרה שומרת על החום'
  },
  {
    title: 'מהי אנרגיה סולארית?',
    content: `ניתן לקלוט את חום השמש בתוך לוחות מיוחדים הנקראים לוחות סולאריים או קולטי שמש. לוחות אלה מכילים מים שסופחים את החום ומתחממים. ישראל היא אחת המדינות היחידות בעולם בהן משתמשים בלוחות שמש לצורך חימום מים בבתים.\n\nבנוסף, קיימים לוחות סולאריים המכילים תאים פוטו-וולטאיים. לוחות אלו קולטים את אור השמש וממירים אותו ישירות לחשמל, ללא שלב ביניים של חימום מים. בעוד שקולטי מים נפוצים מאוד בישראל מזה שנים רבות, השימוש בפאנלים פוטו-וולטאיים לייצור חשמל הולך ומתרחב משמעותית בשנים האחרונות.`,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    imageAlt: 'לוחות סולאריים קולטים אנרגיית שמש'
  },
  {
    title: 'מדוע יש טמפרטורה?',
    content: `הטמפרטורה אומרת לנו כמה חם או קר האויר. הטמפרטורה מושפעת מאוד על ידי מזג האויר ועוזרת לנו לדעת מה ללבוש כדי להגן על גופנו ובריאותנו.`
  },
  {
    title: 'כיצד מודדים את טמפרטורת האויר?',
    content: `מדחום, שנקרא בלועזית תרומטר, מודד את הטמפרטורה. כדי למדוד את טמפרטורת האויר יש להגן על המדחום מפני השמש ולהציבו לפחות 1.5 מטר מעל האדמה.`,
    image: thermometerDiagram,
    imageAlt: 'תרשים כיצד למדוד נכון טמפרטורת אוויר - הגנה מפני השמש והצבה בגובה 1.5 מטר מעל האדמה'
  }]

},
{
  id: 'air-pressure',
  number: 2,
  title: 'לחץ אויר',
  icon: <Gauge className="w-5 h-5" />,
  sections: [
  {
    title: 'מהו לחץ אויר?',
    content: `כאשר אנו נוסעים במכונית ממקום גבוה למקום נמוך ולהפך, או בעת שאנו ממריאים במטוס או נוחתים, אנו מרגישים לחץ קל ובלתי נעים באוזנינו. אנו, למעשה, מרגישים בשינויים בלחץ האויר בגלל ההבדים המהירים בגובה.\n\nלחץ אויר נוצר בגלל משקל כל האויר באטמוספרה שלוחץ על פני האדמה.`,
    image: airPressureAltitudeDiagram,
    imageAlt: 'תרשים לחץ אוויר - שינויי לחץ לפי גובה והשפעה על האוזניים'
  },
  {
    title: 'מהם ההבדים בלחץ האויר?',
    content: `כשהאויר עולה הוא משאיר מתחתיו אזור של לחץ אויר נמוך. לעומת זאת, אזור של לחץ אויר גבוה נוצר בזמן שהאויר שוקע ולוחץ על האדמה.\n\nהאוירנע וזורם מאזורים של לחץ אויר גבוה לאזורים של לחץ אויר נמוך, וכך נוצרות רוחות.`,
    image: airPressureDiagram,
    imageAlt: 'תרשים כיצד נוצרת הרוח - אזורי לחץ אוויר�� ונמוך'
  },
  {
    title: 'מהם שקעים ורמות?',
    content: `שקעים הם אזורים של לחץ אויר נמוך, ובמרכזם נמצא הלחץ הנמוך ביותר. רמות הן אזורים של לחץ אויר גבוה, ובמרכזן נמצא הלחץ הגבוה ביותר.\n\nשקעים מביאים, בדרך כלל, מזג אויר מעונן וגשום. הרמות מביאים מזג אויר בהיר ויבש.`,
    image: pressureSystemsDiagram,
    imageAlt: 'תרשים הבנת שקעים ורמות - רמה ברומטרי מביאה מזג אויר בהיר ויבש, שקע ברומטרי מביא מזג אויר מעונן וגשום'
  },
  {
    title: 'כיצד מודדים את לחץ האויר?',
    content: `לחץ האויר נמדד ביחידת מידה שנקראת מיליבר ובאמצעות מד לחץ אויר שנקרא בלועזית ברומטר. הברומטר הפשוט ביותר הוא ברומטר כספית שמודד את לחץ האויר במילימטרים.`,
    image: barometerDiagram,
    imageAlt: 'תרשים ברומטר כספית פשוט ועקרון הפעולה - כיצד עובד הברומטר, יחידות מידה והמרה'
  }]

},
{
  id: 'humidity-clouds',
  number: 3,
  title: 'לחות האויר, עננים ומשקעים',
  icon: <Droplets className="w-5 h-5" />,
  sections: [
  {
    title: 'מדוע חשובה הלחות באוויר?',
    content: `האויר מכיל לחות במצב מוצק, נוזל או גז. ללחות באטמוספרה תפקיד חשוב במזג האויר כאשר היא משתנה ממצב צבירה אחד למצב צבירה אחר. הדבר קורה בתהליך ההתעבות שבו הופכת אדי מים לטיפת מים או לקפוא לגבישי קרח זעירים. מיליארדים של חלקיקי מים מרכיבים כל ענן וענן. אדי מים יכולים להתעבות גם על גבי חלקיקי אבק ועשן באוויר.`,
    image: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&q=80',
    imageAlt: 'עננים לבנים בשמים כחולים - לחות באוויר'
  },
  {
    title: 'מהיכן מגיעה הלחות באוויר?',
    content: `מקור הלחות באוויר הוא המים שמכסים כ-70% מכדור הארץ. רוב המים נמצאים באוקיינוסים. האוקיינוס השקט הוא הגדול באוקיינוסים ומכסה קרוב למחצית כדור הארץ.`,
    image: humiditySourceDiagram,
    imageAlt: 'תרשים מאין מגיעה הלחות באוויר - מחזור המים מהאוקיינוס לאטמוספירה'
  },
  {
    title: 'כיצד מופיעים המים באוויר?',
    content: `המים מופיעים באוויר בשלושה מצבי צבירה:\n1. גז – אדי מים באוויר\n2. נוזל – טיפות מים\n3. מוצק – גבישי קרח\n\nהמים משתנים ממצב נוזל לגז על ידי התאדה, וממצב גז לנוזל על ידי התעבות.`,
    image: waterStatesDiagram,
    imageAlt: 'תרשים שלושת מצבי הצבירה של המים באוויר - גז, נוזל ומוצק'
  },
  {
    title: 'מהו מחזור המים?',
    content: `אין המים מתחדשים לעולם. הגשם שיורד בחוץ, ירד כבר מיליון פעמים בעבר. המים שעל פני כדור הארץ מנוצלים שוב ושוב.\n\nהשמש מחממת את האוקיינוסים והימים, כך שמיליוני ליטרים של מים מתאדים והופכים לאדי מים; זהו תהליך ההתאדה. כשאדי המים עולים באוויר, הם מתקררים והופכים בחזרה למים נוזליים; וזהו תהליך ההתעבות.`,
    image: waterCycleDiagram,
    imageAlt: 'תרשים מהו מחזור המים - תהליך האידוי, ההתעבות והגשם'
  },
  {
    title: 'מהי לחות יחסית?',
    content: `הלחות היחסית מתוארת באחוזים (%). בימים גשומים ורטובים מאוד הלחות היחסית יכולה להתקרב ל-100%. במצב זה, האויר מלא בלחות (רווי לחות).`,
    image: relativeHumidityDiagram,
    imageAlt: 'תרשים מה זה בכלל 100% לחות - הסבר על לחות יחסית והתעבות'
  },
  {
    title: 'מהי התעבות?',
    content: `ההתעבות היא תהליך בו הופכים אדי מים לטיפת מים. קיימים שני סוגים של התעבות; התעבות על האדמה ועל עצמים (טל או כפור), והתעבות באוויר (עננים או ערפל).`,
    image: condensationDiagram,
    imageAlt: 'תרשים התעבות - כשהאדים הופכים לטיפות, המעבר מגז לנוזל'
  },
  {
    title: 'כיצד נוצרים עננים?',
    content: `עננים נוצרים כאשר אויר חם עולה ומתקרר במידה מספקת, כדי לגרום לאדי המים שבו להתעבות לטיפונות מים או לקפוא לגבישי קרח זעירים. מיליארדים של חלקיקי מים מרכיבים כל ענן.`,
    image: cloudFormationDiagram,
    imageAlt: 'תרשים כיצד נוצרים עננים - אוויר חם עולה, מתקרר והתעבות'
  },
  {
    title: 'כיצד מודדים את כיסוי העננים בשמים?',
    content: `מספר העננים שמכסים את השמים נמדד בשמיניות. 0 שמיניות - השמים נקיים מעננים. 8 שמיניות - השמים מעוננים לגמרי.`,
    image: cloudCoverageScaleDiagram,
    imageAlt: 'תרשים מדידת כיסוי שמיים - סקאלת השמיניות מ-0/8 עד 8/8'
  },
  {
    title: 'מהו ערפל?',
    content: `הערפל הוא ענן נמוך שנוצר כאשר האויר מתקרר קרוב לאדמה. ערפל־ים נוצר כאשר אויר חם זורם מעל ים קר.`,
    image: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?w=800&q=80',
    imageAlt: 'ערפל כבד מעל נוף'
  },
  {
    title: 'מהו טל?',
    content: `הטל הוא טיפות מים קטנות שנוצרות על עצמים קרים בלילה. כשהאויר מתקרר בלילה הוא מגיע לטמפרטורה שבה לא יכול להכיל יותר אדי מים - זו נקודת הטל.`,
    image: 'https://images.unsplash.com/photo-1518173946687-a4c036bc019a?w=800&q=80',
    imageAlt: 'טיפות טל על עלה ירוק'
  },
  {
    title: 'מהו כפור?',
    content: `בלילה חורף, אם הטמפרטורה יורדת מתחת ל-0 מעלות צלזיוס, אדי מים באוויר יקפאו מייד לגבישי קרח זעירים הנקראים כפור.`,
    image: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=800&q=80',
    imageAlt: 'גבישי כפור על צמחים'
  },
  {
    title: 'מהם משקעים?',
    content: `המשקעים נוצרים בעננים, יורדים באוויר ושוקעים על פני הארץ. הגשם הוא צורת משקעים נוזלית, ואילו השלג והברד הם צורות משקעים מוצקות.`,
    image: 'https://images.unsplash.com/photo-1438449805896-28a666819a20?w=800&q=80',
    imageAlt: 'גשם יורד בחוזקה'
  },
  {
    title: 'כיצד נוצר גשם?',
    content: `הגשם נוצר בעננים כאשר טיפות מים קטנטנות מתלכדות יחד לטיפה גדולה יותר. טיפת גשם חייבת להכיל לפחות 1,000 טיפות ענן כדי ליפול כגשם.`,
    image: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&q=80',
    imageAlt: 'טיפת גשם על חלון'
  },
  {
    title: 'מהי קשת בענן?',
    content: `הקשת בענן נוצרת בגלל התעקמות של קרני שמש שעוברות בתוך מיליוני טיפות גשם. כדי שתיווצר קשת, יש צורך בשמש בהירה וגשם באותו הזמן.`,
    image: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&q=80',
    imageAlt: 'קשת בענן צבעונית'
  },
  {
    title: 'מהו שלג?',
    content: `פתיתי שלג נוצר כאשר אדי מים באוויר קופאים לגבישי קרח שמתחברים יחד. לרוב גבישי השלג שש צלעות. מיליארדים רבים של גבישי שלג יורדים, אך לא נמצאו שני גבישים זהים!`,
    image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&q=80',
    imageAlt: 'שלג יורד - פתיתי שלג'
  },
  {
    title: 'מהו ברד?',
    content: `הברד נופל מענן סופה שנקרא קומולונימבוס. בענן מסוג זה נישאים גבישי קרח על זרמי אויר מעלה ומטה וגדלים בשכבות כמו בצל עד שנעשים כבדים ונופלים.`,
    image: 'https://images.unsplash.com/photo-1612119284746-35e7ff177d48?w=800&q=80',
    imageAlt: 'ברד על הקרקע'
  }]

}];


// Continue chapters array in next part...
const chapters2: Chapter[] = [
{
  id: 'air-masses',
  number: 4,
  title: 'גושי אויר וחזיתות',
  icon: <Wind className="w-5 h-5" />,
  sections: [
  {
    title: 'מהם גושי אויר?',
    content: `גושי אויר הם גופים עצומים של אויר. כל גוש אויר הוא כמו ים גדול של אויר. גושי אויר יכולים להיות חמים, קרים, יבשים או לחים לפי התכונות של פני האדמה או הים עליהם הם עוברים.`,
    image: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=800&q=80',
    imageAlt: 'עננים נעים בשמים - גושי אויר'
  },
  {
    title: 'כיצד ממיינים את גושי האויר?',
    content: `ממיינים את גושי האויר לפי התכונות של האזור בו נוצרו:\n\n• גושי אויר קרים שנוצרו על יד הקטבים נקראים גושי אויר קוטביים\n• גושי אויר חמים שנוצרו באזורים טרופיים נקראים גושי אויר טרופיים\n• גושי אויר שנוצרו מעל אוקיינוסים הם לחים - גושי אויר ימיים\n• גושי אויר שנוצרו מעל יבשות הם יבשים - גושי אויר יבשתיים`
  },
  {
    title: 'מהם הסוגים של גושי אויר?',
    content: `ניתן להבחין בארבעה סוגים של גושי אויר:\n\n1. גוש אויר קוטבי־ימי: קר ולח\n2. גוש אויר קוטבי־יבשתי: קר ויבש\n3. גוש אויר טרופי־ימי: חם ולח\n4. גוש אויר טרופי־יבשתי: חם ויבש`
  },
  {
    title: 'מהן חזיתות?',
    content: `גושי אויר מסוגים שונים מתנגשים זה בזה. הגבולות בין גושי האויר נקראים חזיתות. בסמוך לחזיתות, מזג האויר נעשה פעיל עם עננים ומשקעים.`,
    image: 'https://images.unsplash.com/photo-1527482937786-6f47f5f8cff7?w=800&q=80',
    imageAlt: 'שמים סוערים - מפגש גושי אויר'
  },
  {
    title: 'מהם סוגי החזיתות?',
    content: `ניתן להבחין בארבעה סוגים של חזיתות:\n\n1. חזית נייחת: כשלגושי האויר משני הצדדים כוחות שווים\n2. חזית קרה: גוש אויר קר דוחף את האויר החם\n3. חזית חמה: גוש אויר חם דוחף את האויר הקר\n4. חזית מלוכדת: החזית הקרה מתלכדת עם החמה`
  },
  {
    title: 'מה קורה בחזיתות השונות?',
    content: `בחזית קרה - גוש אויר קר דוחף אויר חם למעלה, נוצרים עננים וגשמים חזקים.\n\nבחזית חמה - אויר חם עולה באיטיות על האויר הקר, נוצרים משקעים ממושכים.\n\nבחזית מלוכדת - גושי אויר קרים מקיפים את האויר החם ומרימים אותו, נוצרים משקעים מרובים.`,
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&q=80',
    imageAlt: 'עננים כבדים - חזית מביאה גשם'
  },
  {
    title: 'מהו שקע חזיתי?',
    content: `שקע חזיתי הוא אזור של לחץ אויר נמוך שיש בו חזיתות. שקעים חזיתיים גורמים לשינויים מהירים במזג האויר ומביאים גשמים ושלגים.`,
    image: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=800&q=80',
    imageAlt: 'שמים סוערים - שקע חזיתי'
  }]

},
{
  id: 'winds',
  number: 5,
  title: 'רוחות',
  icon: <Wind className="w-5 h-5" />,
  sections: [
  {
    title: 'מהי רוח?',
    content: `רוח היא אויר בתנועה. השמש מחממת אזורים מסוימים בכדור הארץ יותר מאזורים אחרים, והרוחות מפזרות את החום בצורה אחידה יותר.`,
    image: 'https://images.unsplash.com/photo-1527482937786-6f47f5f8cff7?w=800&q=80',
    imageAlt: 'עצים מתנועעים ברוח'
  },
  {
    title: 'מדוע נושבת רוח?',
    content: `האויר זורם בגלל הבדים בלחץ האויר סביב העולם. הרוח נושבת מהלחץ הגבוה אל הלחץ הנמוך בכדי לאזן אותם.`,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    imageAlt: 'רוח נושבת בנוף פתוח'
  },
  {
    title: 'אילו רוחות יש?',
    content: `ניתן להבחין בשלוש קבוצות עיקריות של רוחות:\n\n1. רוחות רום - בגובה רב\n2. רוחות שטח - קרוב לפני כדור הארץ\n3. רוחות מקומיות - באזורים מוגבלים`
  },
  {
    title: 'מהם זרמי סילון?',
    content: `זרמי סילון הם רוחות חזקות מאוד בגובה של 10 קילומטרים שמגיעות למהירות של 200 קילומטר בשעה ויותר. אורכו של זרם סילון יכול להגיע ל-4,000 קילומטר!`,
    image: 'https://images.unsplash.com/photo-1436891620584-47fd0e565afb?w=800&q=80',
    imageAlt: 'מטוס בגובה רב - זרמי סילון'
  },
  {
    title: 'מהן רוחות סחר?',
    content: `רוחות סחר הן רוחות הנושבות לכיוון קו המשווה. במאה ה-18 נעזרו סירות המפרש ברוחות אלו כדי לחצות את האוקיינוס האטלנטי לצורך מסחר. ללא עזרת רוחות הסחר לא היה מגלה קולומבוס את אמריקה בשנת 1492!`,
    image: 'https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=800&q=80',
    imageAlt: 'ספינת מפרש - רוחות סחר'
  },
  {
    title: 'מהי בריזת ים ומהי בריזת יבשה?',
    content: `בריזות הן רוחות מקומיות שנוצרות לאורך חופים.\n\nביום - היבשה מתחממת מהר יותר מהים, אויר חם עולה, ורוח קרירה מהים נושבת ליבשה. זו בריזת ים.\n\nבלילה - היבשה מתקררת מהר יותר, והרוח נושבת מהיבשה לים. זו בריזת יבשה.`,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    imageAlt: 'חוף ים - בריזת ים ויבשה'
  },
  {
    title: 'כיצד מודדים רוח?',
    content: `מהירות וכיוון הרוח נמדדים בעזרת מד רוח (אנמומטר). כיוון הרוח נמדד על פי הכיוונים במצפן, ומהירות הרוח נמדדת בקילומטר לשעה.`,
    image: 'https://images.unsplash.com/photo-1563974318767-a4de855d7b43?w=800&q=80',
    imageAlt: 'מכשירי מדידת מזג אויר'
  },
  {
    title: 'מהו סולם בופורט?',
    content: `סולם בופורט הומצא ב-1805 על ידי האדמירל בופורט, בכדי לדעת את מהירות הרוח על פי הצפייה בתנועת עצמים.`,
    image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80',
    imageAlt: 'רוח חזקה מנעה עצים'
  },
  {
    title: 'מהו כוח קוריוליס?',
    content: `כיוון הרוח מושפע על ידי כוח קוריוליס בגלל סיבוב כדור הארץ. מצפון לקו המשווה הרוחות נוטות ימינה, ומדרום לקו המשווה הרוחות נוטות שמאלה.`,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    imageAlt: 'כדור הארץ מהחלל - סיבוב כדור הארץ'
  },
  {
    title: 'מהי אנרגית רוח?',
    content: `טורבינות רוח מפיקות חשמל מכוח הרוח. בדנמרק בנו טורבינת רוח ענקית בגובה 50 מטר שמפיקה חשמל מספיק ל-120 בתי מגורים!`,
    image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80',
    imageAlt: 'טורבינות רוח מייצרות חשמל'
  }]

}];


const chapters3: Chapter[] = [
{
  id: 'severe-weather',
  number: 6,
  title: 'תופעות מזג אויר חמורות',
  icon: <CloudLightning className="w-5 h-5" />,
  sections: [
  {
    title: 'מהו מזג אויר חמור?',
    content: `מזג אויר חמור הוא מזג אויר סוער ואים במיוחד שעלול לגרום נזק רבpurchase ולצומח. מזג אויר כזה הוא מסוכן ועלול לפצוע או לקטול אנשים ובעלי חיים.\n\nעם התפתחות המדע והטכנולוגיה קל יותר למטאורולוגים לחזות סופות חמורות ולהזהיר מפני אסונות.`,
    image: 'https://images.unsplash.com/photo-1527482937786-6f47f5f8cff7?w=800&q=80',
    imageAlt: 'ענן סופה כבד בשמים'
  },
  {
    title: 'מהי סופת רעמים?',
    content: `סופות רעמים נוצרות בענני קומולונימבוס, לרוב באויר לח מאוד. סופת רעמים נוצרת כאשר מופיעים ברקים ונשמעים רעמים. סופת רעמים יכולה להימשך עד שעה.`,
    image: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800&q=80',
    imageAlt: 'ענן קומולונימבוס ענק - ענן סופת רעמים'
  },
  {
    title: 'מהו ברק?',
    content: `הברק נוצר כאשר מטען חשמלי חיובי מתרכז בחלקו העליון של ענן הקומולונימבוס ומטען שלילי מתרכז בתחתיתו. כאשר ההבדל בין המטענים גדול מספיק, נוצר זרם חשמלי פתאומי - זהו הברק.\n\nהטמפרטורה של הברק מגיעה ל-30,000 מעלות צלזיוס!`,
    image: 'https://images.unsplash.com/photo-1461511540489-42fe6f032b4b?w=800&q=80',
    imageAlt: 'ברקים מכים בקרקע'
  },
  {
    title: 'מהו רעם?',
    content: `הברק מחמם את האויר לטמפרטורה גבוהה פי 5 מפני השמש. האויר שמתחמם בפתאומיות מתפשט במהירות וגורם לקול רעם. אנו רואים את הברק לפני שאנו שומעים את הרעם כי מהירות האור גבוהה יותר ממהירות הקול.`
  },
  {
    title: 'כיצד ניתן לדעת את מרחק הברק מאיתנו?',
    content: `נספור את השניות שעוברות משנראה ברק ועד שאנו שומעים רעם. שלוש שניות שוות לקילומטר אחד.\n\nלדוגמה: 15 שניות בין הברק לרעם = הברק במרחק 5 קילומטרים.`
  },
  {
    title: 'מהו טורנדו?',
    content: `הטורנדו הוא עמוד אויר המסתחרר במהירות רבה. הטורנדו נראה מרחוק כענן בצורת משפך שפוגע באדמה. רוב הטורנדו מתרחשים במישורים הגדולים של ארצות הברית.`,
    image: 'https://images.unsplash.com/photo-1527482937786-6f47f5f8cff7?w=800&q=80',
    imageAlt: 'סופה חזקה - טורנדו'
  },
  {
    title: 'מהו נד מים?',
    content: `נד מים הוא כעין טורנדו חלש שנוצר מעל הים. מהירות הרוח בו עשויה להגיע ל-150 קילומטר בשעה. נדי מים נוצרים בים התיכון מול חופי ארצנו.`,
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
    imageAlt: 'ים סוער'
  },
  {
    title: 'מהם הוריקנים וטייפונים?',
    content: `הוריקן וטייפון הם שמות לסופה נרחבת ומסתובבת שנוצרת מעל אוקיינוסים טרופיים חמים. הסופה נקראת הוריקן באוקיינוס האטלנטי, טייפון באוקיינוס השקט, וציקלון באוקיינוס ההודי.\n\nמהירות הרוח בסופה מגיעה ל-120 עד 250 קילומטר בשעה!`,
    image: 'https://images.unsplash.com/photo-1509257234328-f4f31b5ec1b3?w=800&q=80',
    imageAlt: 'סופה טרופית מעל הים'
  },
  {
    title: 'מדוע אין הוריקנים פוגעים בישראל?',
    content: `הים התיכון קטן מדי בהשוואה לאוקיינוסים הגדולים שמספקים לחות מרובה הדרושה להוריקנים. הים התיכון גם מוקף יבשות שמונעות כניסה הוריקנים מאוקיינוסים אחרים.`
  },
  {
    title: 'מהי עין הסופה?',
    content: `עין הסופה היא אזור ללא עננים במרכז ההוריקן בקוטר של 30-50 קילומטר. בעין הסופה האויר שוקע והרוחות קלות. כשעין הסופה עוברת, הגשם והרוח פוסקים לזמן קצר ומתחילים שוב.`,
    image: 'https://images.unsplash.com/photo-1527482937786-6f47f5f8cff7?w=800&q=80',
    imageAlt: 'ענני סופה מסתחררים'
  },
  {
    title: 'מהן מפולות שלג?',
    content: `מפולות שלג קורות כאשר מצטבר שלג רב ובשכבה עבה על מדרון הר, ואז לפתע כל השלג נופל מטה. משקל השלג יכול להגיע למיליון טונות ומהירות המפולת ליותר מ-320 קילומטר בשעה!`,
    image: 'https://images.unsplash.com/photo-1478719059408-592965723cbc?w=800&q=80',
    imageAlt: 'הר מושלג - מפולת שלג'
  }]

},
{
  id: 'extreme-conditions',
  number: 7,
  title: 'תנאי מזג אויר קיצוניים',
  icon: <Thermometer className="w-5 h-5" />,
  sections: [
  {
    title: 'מהם תנאי מזג אויר קיצוניים?',
    content: `תנאי מזג אויר קיצוניים, כגון שטפונות ובצורות, מפריעים לתנאים הרגילים של מזג האויר. באזורים מסוימים הם מתרחשים בכל שנה בעונה מסוerta.`,
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
    imageAlt: 'מזג אויר קיצוני - סופה'
  },
  {
    title: 'מהי בצורת?',
    content: `מחסור בגשם לאורך שבועות וחודשים גורם לבצורת. בצורות קורות כאשר רמות (אזורים של לחץ אויר גבוה) חוסמות את השקעים שמביאים גשם.`,
    image: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',
    imageAlt: 'אדמה יבשה וסדוקה - בצורת'
  },
  {
    title: 'מהם נזqui השטפונות?',
    content: `שטפונות עלולים לגרום נזקים של מיליארדי דולרים והרוגים רבים. אנשים רבים עדיין גרים באזורים המועדים לשטפונות בגלל שהאדמה פוריה לחקלאות.`,
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80',
    imageAlt: 'שיטפון מציף רחוב'
  },
  {
    title: 'מהם שטפונות פתע?',
    content: `שטפונות פתע הם שטפונות המתרחשים בפתאומיות. הם הרסניים ביותר כי הם דוחפים כמויות עצומות של סחף, בוץ וסלעים.`,
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    imageAlt: 'מים זורמים בעוצמה'
  },
  {
    title: 'מדוע נוצרים שטפונות פתע?',
    content: `1. כאשר סופת רעמים מורידה גשם כבד מאוד באותו מקום - יותר מ-50 מילימטר בשעה. האדמה לא מצליחה לספוג את המים והם זורמים לנחלים.\n\n2. כאשר שלג רב מפשיר בבת אחת בגלל מזג אויר חם באביב.`
  },
  {
    title: 'כיצד מתגוננים מפני שטפונות?',
    content: `ערים רבות בנו מערכות ניקוז גדולות ותעלות למי גשם. בערים לאורך החופים בנו קירות גבוהים להגנה מפני גלים בזמן סערה. ליד נהרות גדולים הקימו סכרים וסוללות עפר.`,
    image: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',
    imageAlt: 'סכר מים - הגנה מפני שיטפונות'
  }]

},
{
  id: 'acid-rain',
  number: 8,
  title: 'גשם חומצי',
  icon: <FlaskConical className="w-5 h-5" />,
  sections: [
  {
    title: 'מהו גשם חומצי?',
    content: `טיפות מים, שנוצרות בעננים מעל לאזורי תעשיה, יכולות להכיל בתוכן חומרים מזהמים, שגורמים להן להיות חומציות (בדומה לטיפת מיץ לימון). כשטיפות מים אלה יורדות מהעננים הן נקראות גשם חומצי.`,
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
    imageAlt: 'ארובות מפעל פולטות עשן - גורם לגשם חומצי'
  },
  {
    title: 'מהם הנזקים שנגרמים בגלל גשם חומצי?',
    content: `בעלי חיים רבים שחיים בנהרות ובאגמים מתים כתוצאה מזיהום המים. עצים וצמחים נחלשים ומתים.\n\nגשם חומצי גם ממיס סלעים ופוגע במבנים ובפסלים עתיקים. הפירמידות במצרים, הקולוסיאום ברומא ומבנים היסטוריים רבים נפגעו מגשם חומצי.`,
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80',
    imageAlt: 'יער נפגע - נזק סביבתי'
  }]

},
{
  id: 'seasons',
  number: 9,
  title: 'עונות השנה',
  icon: <CalendarDays className="w-5 h-5" />,
  sections: [
  {
    title: 'מה גורם סיבוב כדור הארץ סביב צירו?',
    content: `דרך כדור הארץ עובר ציר דמיוני שמחבר בין שני הקטבים. סביב ציר זה מסתובב כדור הארץ. הציר נטוי ב-23.5 מעלות - וזו הסיבה לעונות השנה!`,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    imageAlt: 'כדור הארץ מהחלל'
  },
  {
    title: 'מה גורם סיבוב כדור הארץ סביב השמש?',
    content: `כדור הארץ מקיף את השמש ומשלים סיבוב ב-365.25 ימים - שנה אחת. בגלל נטיית הציר, לפעמים חצי הכדור הצפוני מוטה לעבר השמש (קיץ אצלנו) ולפעמים רחוק ממנה (חורף אצלנו).`,
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    imageAlt: 'כדור הארץ וחלל'
  },
  {
    title: 'למה חם בקיץ יותר מבחורף?',
    content: `אנשים רבים מאמינים שבקיץ כדור הארץ קרוב יותר לשמש - אך זה לא נכון!\n\nהשינויים בטמפרטורה נגרמים בגלל:\n1. אורך היום - בקיץ הימים ארוכים יותר\n2. זווית קרני השמש - בקיץ הקרני מגיעות בזווית ישרה יותר`,
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80',
    imageAlt: 'שמש חמה בקיץ'
  },
  {
    title: 'כיצד משפיע אורך היום על הטמפרטורה?',
    content: `ככל ששעות השמש רבות יותר, עולה הטמפרטורה. היום הארוך ביותר בחצי הכדור הצפוני הוא 21-22 ביוני.\n\nימי השוויון (יום ולילה שווים באורכם) חלים ב-22-23 בספטמבר וב-21-22 במרס.`
  },
  {
    title: 'כיצד משפיעה זווית קרני השמש?',
    content: `ככל שזווית קרני השמש ישרה יותר (בקיץ), הן מתפזרות על שטח קטן יותר ולכן חזקות יותר.\n\nבחורף, הקרני מגיעות בזווית נמוכה ומתפזרות על שטח גדול - לכן חלשות יותר.`
  },
  {
    title: 'האם עונות השנה שוות בכל מקום?',
    content: `לא! באזורים הסמוכים לקו המשווה יש חום כל השנה ואין עונות ברורות.\n\nבקטבים יש רק שתי עונות - קיץ קצר עם יום ארוך של 24 שעות, וחורף ארוך עם לילה של 24 שעות.`,
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
    imageAlt: 'ארבע עונות השנה - עצים בצבעים שונים'
  }]

}];


const allChapters = [...chapters, ...chapters2, ...chapters3];

export default function Encyclopedia() {
  const [activeChapterId, setActiveChapterId] = useState(allChapters[0].id);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [modalImage, setModalImage] = useState<{src: string;alt: string;} | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeChapter = allChapters.find((c) => c.id === activeChapterId) || allChapters[0];
  const currentIndex = allChapters.findIndex((c) => c.id === activeChapterId);

  const goToChapter = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < allChapters.length) {
      setActiveChapterId(allChapters[newIndex].id);
      setExpandedSections(new Set([0]));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const openImageModal = (src: string, alt: string) => {
    setModalImage({ src, alt });
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setModalImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div data-ev-id="ev_d308030eac" className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir="rtl">
      {/* Header */}
      <header data-ev-id="ev_67e03b7bd9" className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div data-ev-id="ev_baed56c4af" className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div data-ev-id="ev_cc16459b86" className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              <Home className="w-6 h-6" />
            </Link>
            <div data-ev-id="ev_e38b43030b" className="h-6 w-px bg-slate-600" />
            <h1 data-ev-id="ev_f0717550e7" className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-sky-400" />
              אנציקלופדיית מזג אויר לכל
            </h1>
          </div>
          <p data-ev-id="ev_b7fd6c5a7f" className="text-slate-400 text-base hidden md:block">
            יעוץ מדעי: אבי יעקבי, חזאי מטאורולוגי
          </p>
        </div>
      </header>

      <div data-ev-id="ev_1c08cf6786" className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside data-ev-id="ev_ddc9acc6f8" className="hidden lg:block w-96 flex-shrink-0">
          <div data-ev-id="ev_9392bc3acc" className="sticky top-28 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
            <h2 data-ev-id="ev_900ae8e20d" className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-sky-400" />
              תוכן העניינים
            </h2>
            <nav data-ev-id="ev_73392bffb8" className="flex flex-col gap-3">
              {allChapters.map((chapter) =>
              <button data-ev-id="ev_e398301365"
              key={chapter.id}
              onClick={() => {
                setActiveChapterId(chapter.id);
                setExpandedSections(new Set([0]));
              }}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl text-right transition-all ${
              activeChapterId === chapter.id ?
              'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
              'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`
              }>

                  <span data-ev-id="ev_e42ed215c1" className={`flex-shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-lg md:rounded-2xl bg-sky-500/30 flex items-center justify-center text-sky-400 ${
                activeChapterId === chapter.id ? 'md:scale-100' : 'md:scale-125'}`
                }>
                    <span data-ev-id="ev_2a64955ce3" className="scale-110">{chapter.icon}</span>
                  </span>
                  <span data-ev-id="ev_6943a52acd" className="text-base md:text-xl font-medium">
                    {chapter.number !== 0 && chapter.number !== '' && `${chapter.number}. `}{chapter.title}
                  </span>
                </button>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main data-ev-id="ev_53d64c5424" className="flex-1 min-w-0 max-w-2xl">
          {/* Mobile Chapter Selector - Hamburger Button */}
          <div data-ev-id="ev_b8a4b73c3d" className="lg:hidden mb-6">
            <button data-ev-id="ev_a2b1a27e22"
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm">
              <Menu className="w-5 h-5 text-sky-400" />
              <span data-ev-id="ev_570f36ef25">תוכן העניינים</span>
              <span data-ev-id="ev_4c3b31d15f" className="text-slate-400 mr-auto">{activeChapter.title}</span>
            </button>
          </div>

          {/* Chapter Header */}
          <div data-ev-id="ev_ca977893d0" className="bg-gradient-to-r from-sky-500/20 via-blue-500/20 to-purple-500/20 rounded-2xl md:rounded-3xl p-5 md:p-8 mb-6 md:mb-8 border border-sky-500/20">
            <div data-ev-id="ev_d5a74d6395" className="flex items-center gap-4 md:gap-5">
              <div data-ev-id="ev_26ccc48974" className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-sky-500/30 flex items-center justify-center text-sky-400">
                <span data-ev-id="ev_9a20f7f699" className="scale-100 md:scale-125">{activeChapter.icon}</span>
              </div>
              <div data-ev-id="ev_2f9b031e8e">
                {activeChapter.number !== 0 && activeChapter.number !== '' &&
                <span data-ev-id="ev_d71bc72707" className="text-sky-400 text-sm md:text-lg font-medium">פרק {activeChapter.number}</span>
                }
                <h2 data-ev-id="ev_e8c531fd11" className="text-2xl md:text-4xl font-bold text-white">{activeChapter.title}</h2>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div data-ev-id="ev_fdc7158cbe" className="flex flex-col gap-5">
            {activeChapter.sections.map((section, index) =>
            <div data-ev-id="ev_ebbfb127ac"
            key={index}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">

                <button data-ev-id="ev_011d921924"
              onClick={() => toggleSection(index)}
              className="w-full flex items-center justify-between px-5 py-4 md:px-7 md:py-5 text-right hover:bg-slate-700/30 transition-colors">

                  <h3 data-ev-id="ev_c68896f8f0" className="text-base md:text-xl font-bold text-white">{section.title}</h3>
                  <ArrowRight className={`w-5 h-5 md:w-6 md:h-6 text-slate-400 transition-transform ${
                expandedSections.has(index) ? 'rotate-90' : ''}`
                } />
                </button>
                {expandedSections.has(index) &&
              <div data-ev-id="ev_f73c8c90e3" className="pb-5 md:px-7 md:pb-7">
                    <div data-ev-id="ev_0139508e99" className={`flex flex-col ${section.image ? `md:gap-6 ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}` : ''}`}>
                      {section.image &&
                  <div data-ev-id="ev_77b931f734" className="w-full mb-4 md:mb-0 md:w-2/5 md:flex-shrink-0">
                          <div
                      data-ev-id="ev_e48daee951"
                      className="relative overflow-hidden bg-slate-900/50 cursor-pointer hover:ring-2 hover:ring-sky-500/50 transition-all group md:rounded-xl"
                      onClick={() => openImageModal(section.image!, section.imageAlt || '')}>

                            <img data-ev-id="ev_96f87a2493"
                      src={section.image}
                      alt={section.imageAlt || ''}
                      className="w-full h-auto object-contain" />
                            <div data-ev-id="ev_032f3319d4" className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                          <p data-ev-id="ev_675bfb6a39" className="text-slate-400 text-sm mt-2 text-center px-5 md:px-0">{section.imageAlt}</p>
                        </div>
                  }
                      <div data-ev-id="ev_756b4e918e" className={`prose prose-invert max-w-none px-5 md:px-0 ${section.image ? 'md:w-3/5' : ''}`}>
                        {section.content.split('\n\n').map((paragraph, pIndex) =>
                    <p data-ev-id="ev_4f0ae5329d" key={pIndex} className="text-slate-200 text-base md:text-lg leading-relaxed md:leading-loose mb-4 md:mb-5 last:mb-0 whitespace-pre-line">
                            {paragraph}
                          </p>
                    )}
                        {section.note &&
                    <p data-ev-id="ev_09a714b736" className="mt-6 text-yellow-400 dark:text-yellow-400 text-base font-medium">
                            {section.note}
                          </p>
                    }
                      </div>
                    </div>
                  </div>
              }
              </div>
            )}
          </div>

          {/* Navigation */}
          <div data-ev-id="ev_fc66526d42" className="flex items-center justify-between mt-6 md:mt-10 pt-5 md:pt-8 border-t border-slate-700">
            <button data-ev-id="ev_017e2c6471"
            onClick={() => goToChapter('prev')}
            disabled={currentIndex <= 0}
            className="flex items-center gap-1 sm:gap-2 md:gap-3 p-2 sm:px-3 sm:py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-lg">

              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <span data-ev-id="ev_62c0b121f0" className="hidden sm:inline">הקודם</span>
            </button>
            
            <span data-ev-id="ev_fc3988b122" className="text-slate-500 text-xs md:text-lg font-medium">
              {currentIndex + 1} / {allChapters.length}
            </span>

            <button data-ev-id="ev_916717cd8e"
            onClick={() => goToChapter('next')}
            disabled={currentIndex >= allChapters.length - 1}
            className="flex items-center gap-1 sm:gap-2 md:gap-3 p-2 sm:px-3 sm:py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-lg">

              <span data-ev-id="ev_28d31acdb8" className="hidden sm:inline">הבא</span>
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </div>

        </main>
      </div>

      {/* Mobile Table of Contents Drawer */}
      {mobileMenuOpen &&
      <div data-ev-id="ev_51b18ecd7c"
      className="fixed inset-0 z-[100] lg:hidden"
      onClick={() => setMobileMenuOpen(false)}>
          <div data-ev-id="ev_7f9746d79f" className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div data-ev-id="ev_5b74bd6fd4"
        className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-slate-800 border-l border-slate-700 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
            <div data-ev-id="ev_34f27189af" className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h2 data-ev-id="ev_94ad1a93fd" className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-400" />
                תוכן העניינים
              </h2>
              <button data-ev-id="ev_3078146e64"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <nav data-ev-id="ev_7bf4bac58f" className="p-3 flex flex-col gap-1">
              {allChapters.map((chapter) =>
            <button data-ev-id="ev_9fec3d592c"
            key={chapter.id}
            onClick={() => {
              setActiveChapterId(chapter.id);
              setExpandedSections(new Set([0]));
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-right transition-all ${
            activeChapterId === chapter.id ?
            'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
            'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`
            }>
                  <span data-ev-id="ev_7ea437e8ed" className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
              activeChapterId === chapter.id ? 'bg-sky-500/30' : 'bg-slate-700'}`
              }>
                    {chapter.icon}
                  </span>
                  <span data-ev-id="ev_f8e7618bc6" className="text-sm font-medium">
                    {chapter.number !== 0 && chapter.number !== '' && `${chapter.number}. `}{chapter.title}
                  </span>
                </button>
            )}
            </nav>
          </div>
        </div>
      }

      {/* Image Modal */}
      {modalImage &&
      <div data-ev-id="ev_473fdc181d"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={closeImageModal}>

          <button data-ev-id="ev_a896522dad"
        onClick={closeImageModal}
        className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="סגור">

            <X className="w-8 h-8 text-white" />
          </button>
          
          <div data-ev-id="ev_86e1c989cc"
        className="relative max-w-5xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}>

            <img data-ev-id="ev_23ed74706c"
          src={modalImage.src}
          alt={modalImage.alt}
          className="w-full h-auto max-h-[85vh] object-contain rounded-xl" />

            <p data-ev-id="ev_7ca7e8955e" className="text-white text-center mt-4 text-lg">{modalImage.alt}</p>
          </div>
        </div>
      }
    </div>);

}