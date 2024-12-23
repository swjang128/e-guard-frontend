import moment from 'moment';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import { EventEntity } from '../../types/EventEntity';
import { useNavigate } from 'react-router-dom';

interface MainMonitoringAreaIncidentSummaryProps {
  incidentEventList: EventEntity[];
}

const MainMonitoringAreaIncidentSummary: React.FC<
  MainMonitoringAreaIncidentSummaryProps
> = ({ incidentEventList }) => {
  const nav = useNavigate();
  const currentDateTime = moment();

  const criticalIncidentEventList: EventEntity[] = incidentEventList.filter(
    (incidentEvent) => incidentEvent.incidentPriority === 'CRITICAL'
  );
  const alertIncidentEventList: EventEntity[] = incidentEventList.filter(
    (incidentEvent) => incidentEvent.incidentPriority === 'ALERT'
  );
  const warningIncidentEventList: EventEntity[] = incidentEventList.filter(
    (incidentEvent) => incidentEvent.incidentPriority === 'WARNING'
  );

  return incidentEventList.length === 0 ? (
    <div className="w-full rounded border border-stroke px-4 py-2 shadow-1">
      <h4 className="text-lg font-semibold text-black dark:text-white">
        사고 현황
      </h4>
      <div className="grid-row grid gap-1 py-2">
        <div className="grid-row grid gap-1 bg-gray-2 px-2 py-2">
          <p className="font-semibold text-eguard-red">CRITICAL (0)</p>
        </div>
        <div className="grid-row grid gap-1 bg-gray-2 px-2 py-2">
          <p className="font-semibold text-eguard-brown">ALERT (0)</p>
        </div>
        <div className="grid-row grid gap-1 bg-gray-2 px-2 py-2">
          <p className="font-semibold text-eguard-yellow">WARNING (0)</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-full rounded border border-stroke px-4 py-2 shadow-1">
      <h4 className="text-lg font-semibold text-black dark:text-white">
        사고 현황
      </h4>
      <div className="grid-row grid gap-1 py-2">
        <div className="grid-row grid gap-1 bg-gray-2 px-2 py-2">
          <p className="font-semibold text-eguard-red">
            CRITICAL ({criticalIncidentEventList.length})
          </p>
          {criticalIncidentEventList &&
            criticalIncidentEventList.map((critical, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <div className="group relative inline-block cursor-pointer">
                  <div className="flex items-center gap-1">
                    <span className="h-4 w-4 rounded-full bg-gradient-to-r from-eguard-red to-black"></span>
                    <span className="text-eguard-red">
                      {critical.incidentName}
                      {` (${Math.round(
                        Math.abs(
                          moment
                            .duration(
                              moment(critical.createdAt).diff(currentDateTime)
                            )
                            .asHours()
                        )
                      )}시간 전)`}
                    </span>
                  </div>
                  <div className="drop-shadow-4 absolute left-1/2 top-full z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded-md border border-eguard-red bg-black px-4.5 py-1.5 text-sm font-medium text-white opacity-0 group-hover:opacity-100 dark:bg-meta-4">
                    <span className="border-light absolute -top-1 left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm border-eguard-red bg-black dark:bg-meta-4"></span>
                    <p className="text-eguard-red">
                      {critical.incidentPriority}
                    </p>
                    <p>{critical.areaLocation}에서</p>
                    <p>
                      {critical.incidentMessage}{' '}
                      {` (${Math.round(
                        Math.abs(
                          moment
                            .duration(
                              moment(critical.createdAt).diff(currentDateTime)
                            )
                            .asHours()
                        )
                      )}시간 전)`}
                    </p>
                  </div>
                </div>
                <PrimaryButton
                  text="보기"
                  size="sm"
                  additionalClasses="hidden md:block"
                  onClick={() => {
                    nav('/event/area');
                  }}
                />
              </div>
            ))}
        </div>
        <div className="grid-row grid gap-1 bg-gray-2 px-2 py-2">
          <p className="font-semibold text-eguard-brown">
            ALERT ({alertIncidentEventList.length})
          </p>
          {alertIncidentEventList &&
            alertIncidentEventList.map((alert, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <div className="group relative inline-block cursor-pointer">
                  <div className="flex items-center gap-1">
                    <span className="h-4 w-4 rounded-full bg-gradient-to-r from-eguard-brown to-black"></span>
                    <span className="text-eguard-brown">
                      {alert.incidentName}
                      {` (${Math.round(
                        Math.abs(
                          moment
                            .duration(
                              moment(alert.createdAt).diff(currentDateTime)
                            )
                            .asHours()
                        )
                      )}시간 전)`}
                    </span>
                  </div>
                  <div className="drop-shadow-4 absolute left-1/2 top-full z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded-md border border-eguard-brown bg-black px-4.5 py-1.5 text-sm font-medium text-white opacity-0 group-hover:opacity-100 dark:bg-meta-4">
                    <span className="border-light absolute -top-1 left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm border-eguard-brown bg-black dark:bg-meta-4"></span>
                    <p className="text-eguard-brown">
                      {alert.incidentPriority}
                    </p>
                    <p>{alert.areaLocation}에서</p>
                    <p>
                      {alert.incidentMessage}{' '}
                      {` (${Math.round(
                        Math.abs(
                          moment
                            .duration(
                              moment(alert.createdAt).diff(currentDateTime)
                            )
                            .asHours()
                        )
                      )}시간 전)`}
                    </p>
                  </div>
                </div>
                <PrimaryButton
                  text="보기"
                  size="sm"
                  additionalClasses="hidden md:block"
                  onClick={() => {
                    nav('/event/area');
                  }}
                />
              </div>
            ))}
        </div>
        <div className="grid-row grid gap-1 bg-gray-2 px-2 py-2">
          <p className="font-semibold text-eguard-yellow">
            WARNING ({warningIncidentEventList.length})
          </p>
          {warningIncidentEventList &&
            warningIncidentEventList.map((warning, index: number) => (
              <div key={index} className="flex justify-between text-sm">
                <div className="group relative inline-block cursor-pointer">
                  <div className="flex items-center gap-1">
                    <span className="h-4 w-4 rounded-full bg-gradient-to-r from-eguard-yellow to-black"></span>
                    <span className="text-eguard-yellow">
                      {warning.incidentName}
                      {` (${Math.round(
                        Math.abs(
                          moment
                            .duration(
                              moment(warning.createdAt).diff(currentDateTime)
                            )
                            .asHours()
                        )
                      )}시간 전)`}
                    </span>
                  </div>
                  <div className="drop-shadow-4 absolute left-1/2 top-full z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded-md border border-eguard-yellow bg-black px-4.5 py-1.5 text-sm font-medium text-white opacity-0 group-hover:opacity-100 dark:bg-meta-4">
                    <span className="border-light absolute -top-1 left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm border-eguard-yellow bg-black dark:bg-meta-4"></span>
                    <p className="text-eguard-yellow">
                      {warning.incidentPriority}
                    </p>
                    <p>{warning.areaLocation}에서</p>
                    <p>
                      {warning.incidentMessage}{' '}
                      {` (${Math.round(
                        Math.abs(
                          moment
                            .duration(
                              moment(warning.createdAt).diff(currentDateTime)
                            )
                            .asHours()
                        )
                      )}시간 전)`}
                    </p>
                  </div>
                </div>
                <PrimaryButton
                  text="보기"
                  size="sm"
                  additionalClasses="hidden md:block"
                  onClick={() => {
                    nav('/event/area');
                  }}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MainMonitoringAreaIncidentSummary;
