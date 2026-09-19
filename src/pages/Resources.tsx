import { Link } from 'react-router';
import { ArrowRight, ExternalLink, Eye } from 'lucide-react';
import { ReactNode } from 'react';

interface ResourceCardProps {
  title: ReactNode;
  type: 'image' | 'iframe' | 'link';
  url: string;
  aspectRatio?: string;
}

function ResourceCard({ title, type, url, aspectRatio = 'aspect-video' }: ResourceCardProps) {
  return (
    <div data-ev-id="ev_30da4d3a9e" className="bg-slate-800/90 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
      <div data-ev-id="ev_191e453ba1" className="p-4 border-b border-white/10 flex items-center justify-between" dir="rtl">
        <h3 data-ev-id="ev_bea8309f95" className="text-white">{title}</h3>
        <a data-ev-id="ev_181f7c0318"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        title="פתח בחלון חדש">

          <ExternalLink className="w-5 h-5 text-gray-300" />
        </a>
      </div>
      <div data-ev-id="ev_7b3b5b1652" className={`${aspectRatio} bg-slate-900`}>
        {type === 'image' &&
        <img data-ev-id="ev_0ded001b54"
        src={url}
        alt={typeof title === 'string' ? title : 'תמונה'}
        className="w-full h-full object-contain"
        loading="lazy" />

        }
        {type === 'iframe' &&
        <iframe data-ev-id="ev_7c68c659ff"
        src={url}
        className="w-full h-full border-0"
        title={title}
        allowFullScreen />

        }
        {type === 'link' &&
        <a data-ev-id="ev_4b3f951474"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-full flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-colors">

            <span data-ev-id="ev_297847d9ca" className="text-lg">לחץ לפתיחה</span>
            <Eye className="w-5 h-5 mr-2" />
          </a>
        }
      </div>
    </div>);

}

export default function Resources() {
  return (
    <div data-ev-id="ev_1eaf39b3f3" className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900">
      {/* Header */}
      <header data-ev-id="ev_166d2b7599" className="bg-white/5 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div data-ev-id="ev_1add46444c" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div data-ev-id="ev_fa6c41bac8" className="flex items-center justify-between">
            <div data-ev-id="ev_a3b4f370e6" className="flex items-center gap-3">
              <Link
                to="/"
                className="p-2 rounded-lg hover:bg-white/10 transition-colors">

                <ArrowRight className="w-5 h-5 text-gray-300" />
              </Link>
              <h1 data-ev-id="ev_086910833d" className="text-xl font-bold text-white">כלי מזג אוויר</h1>
            </div>
          </div>
        </div>
      </header>

      <main data-ev-id="ev_7738746b06" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div data-ev-id="ev_2c8853b8f8" className="grid grid-cols-1 lg:grid-cols-2 gap-6" dir="rtl">
          {/* Windy */}
          <ResourceCard
            title={<span data-ev-id="ev_d0249cc7ca" className="font-bold">Windy - מפת רוח</span>}
            type="iframe"
            url="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=5&overlay=wind&product=ecmwf&level=surface&lat=32.4679&lon=35.1331&marker=true" />


          {/* Satellite Animation - Meteoblue */}
          <ResourceCard
            title={<span data-ev-id="ev_61ff083cbf" className="font-bold">אנימציית לווין - Meteoblue</span>}
            type="iframe"
            url="https://www.meteoblue.com/en/weather/maps/widget?windAnimation=0&gust=0&satellite=1&cloudsAndPrecipitation=0&temperature=0&sunshine=0&extremeForecastIndex=0&geoloc=detect&tempunit=C&windunit=km%2Fh&lengthunit=metric&zoom=5&autowidth=auto" />


          {/* Rain Radar */}
          <ResourceCard
            title={<span data-ev-id="ev_d916dacd9b" className="font-bold">מכ״ם גשם</span>}
            type="iframe"
            url="https://www.weather1.live/radar/" />


          {/* Turkish Satellite */}
          <ResourceCard
            title={<><span data-ev-id="ev_b030cfb488" className="font-bold">תצלום לווין</span> <span data-ev-id="ev_57e3582c04" className="font-normal">(השמ״ט הטורקי)</span></>}
            type="image"
            url="https://www.mgm.gov.tr/FTPDATA/uzal/uydu/eu_ir.jpg" />


          {/* Day/Night Line */}
          <ResourceCard
            title={<><span data-ev-id="ev_4aa70386e4" className="font-bold">קו ההארה</span> <span data-ev-id="ev_3a5df10df3" className="font-normal">- היכן מואר והיכן חשוך בכדור הארץ עכשיו</span></>}
            type="image"
            url="https://www.not.iac.es/weather/img/latest-xearthX.gif?random=9736527578" />

        </div>

        {/* Attribution */}
        <p data-ev-id="ev_3999481931" className="text-center text-slate-500 text-sm mt-6" dir="rtl">
          התמונות והנתונים מגיעים ממקורות חיצוניים
        </p>
      </main>
    </div>);

}