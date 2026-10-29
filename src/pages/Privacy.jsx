import { Link } from "react-router-dom";
import { site } from "../data.js";
import { pages } from "../seo.js";
import Seo from "../components/Seo.jsx";

const updated = "29 жовтня 2026";

export default function Privacy() {
  return (
    <main id="content" tabIndex={-1} className="mx-auto max-w-[1500px] px-5 pt-28 pb-28 sm:pt-32 md:px-10 md:pb-16 lg:pt-40">
      <Seo page={pages.privacy} />
      <p className="eyebrow">Документи</p>
      <h1 className="mt-4 max-w-4xl font-display text-[2.6rem] leading-[0.92] sm:text-6xl md:text-7xl">
        Політика конфіденційності
      </h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Чинна редакція від {updated}. Так ФОП Найчук Аліна, що працює під назвою ARS VITAE SANCTUM,
        обробляє дані відвідувачів сайту і людей, які записуються на прийом.
      </p>

      <div className="mt-12 max-w-3xl space-y-10 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl">Хто обробляє дані</h2>
          <p>
            Володілець персональних даних — ФОП Найчук Аліна (ARS VITAE SANCTUM), ліцензована медична
            практика за адресою {site.address}.
          </p>
          <p>
            З питань даних можна написати в{" "}
            <a href={site.telegram} className="underline underline-offset-4">
              Telegram
            </a>{" "}
            або зателефонувати{" "}
            <a href={site.phone} className="underline underline-offset-4 whitespace-nowrap">
              {site.phoneLabel}
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl">Які дані ми отримуємо</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>ім'я, номер телефону і месенджер, якщо ви залишаєте їх для запису або відповіді;</li>
            <li>послуга, фахівець і час візиту, які ви обираєте у формі запису;</li>
            <li>відомості з короткої анкети здоров'я перед першим візитом, якщо ви її надсилаєте;</li>
            <li>
              технічні дані, без яких сторінка не відкриється: адреса сторінки, тип браузера і факт
              завантаження файлів сайту;
            </li>
            <li>
              налаштування доступності (розмір тексту, контраст, рух), які зберігаються лише у вашому
              браузері і не відправляються нам як окрема анкета.
            </li>
          </ul>
          <p>Ми не просимо на сайті дані банківської картки і не ведемо рекламних профілів відвідувачів.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl">Навіщо це потрібно</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>щоб записати вас на послугу і підтвердити час;</li>
            <li>щоб підготувати консультацію і вести медичний прийом;</li>
            <li>щоб відповісти на звернення в телефоні або месенджері;</li>
            <li>щоб сайт відкривався і запам’ятовував ваші налаштування доступності на цьому пристрої.</li>
          </ul>
          <p>
            Обробка спирається на вашу згоду, на договір про послугу і на обов’язки щодо медичної
            документації. Порядок відповідає Закону України «Про захист персональних даних».
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl">Кому дані можуть бути передані</h2>
          <p>Ми не продаємо персональні дані і не передаємо їх для чужої реклами. Дані можуть побачити:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>фахівці клініки, яким вони потрібні для вашого візиту;</li>
            <li>сервіс онлайн-запису, через який бронюється час;</li>
            <li>хостинг, на якому працює цей сайт;</li>
            <li>
              Instagram і YouTube, якщо на сторінці відкривається їхній вбудований блок: ці сервіси
              діють за власними правилами і можуть зберігати технічні дані у вашому браузері.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl">Скільки дані зберігаються</h2>
          <p>
            Дані запису і медичні відомості зберігаються стільки, скільки потрібно для візиту, обліку і
            строків, які вимагає законодавство про охорону здоров'я. Налаштування доступності лишаються в
            браузері, доки ви їх не очистите. Звернення в месенджері зберігаються в історії цього
            месенджера.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl">Ваші права</h2>
          <p>Ви можете звернутися до нас і:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>дізнатися, які ваші дані ми маємо;</li>
            <li>виправити неточні дані;</li>
            <li>попросити видалити дані, якщо закон не вимагає їх зберігати;</li>
            <li>відкликати згоду на повідомлення, які не потрібні для вже призначеного візиту.</li>
          </ul>
          <p>
            Якщо відповідь вас не влаштує, можна звернутися до Уповноваженого Верховної Ради України з
            прав людини або до суду.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl">Файли cookie і локальні налаштування</h2>
          <p>
            Сайт не ставить рекламних cookie. Налаштування доступності записуються локально у вашому
            браузері під ключем сайту. Вбудовані блоки Instagram і YouTube можуть використовувати власні
            cookie, коли браузер їх завантажує.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl">Зміни цього тексту</h2>
          <p>
            Якщо порядок роботи з даними зміниться, ми оновимо цю сторінку. Чинною є редакція, яка
            відкрита за адресою політики конфіденційності.
          </p>
          <p>
            <Link to="/#contacts" className="underline underline-offset-4">
              Контакти клініки
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
