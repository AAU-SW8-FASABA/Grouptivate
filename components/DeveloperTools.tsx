import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Container } from "./Container";
import globalStyles from "@/constants/styles";
import { Dropdown } from "react-native-element-dropdown";
import { IconSource, UniversalIcon } from "./ui/UniversalIcon";
import { OtherActivity, SportActivity } from "@/lib/API/schemas/Activity";
import { prettyName } from "@/lib/PrettyName";
import { Metric } from "@/lib/API/schemas/Metric";
import { getHealthAdapter } from "@/lib/HealthAdapter/Helpers";
import {
  isCountOnlyInsertOptions,
  isSportInsertOptions,
} from "@/lib/HealthAdapter/HealthAdapter";
import { SyncActivity } from "@/lib/ActivitySync";
import Constants from "expo-constants";

export function DeveloperTools() {
  const activities = [
    ...Object.values(SportActivity),
    ...Object.values(OtherActivity),
  ]
    .filter((value) => value !== OtherActivity.ActiveCaloriesBurned)
    .map((value) => ({ label: prettyName(value), value }));
  const [activityValue, setActivityValue] = useState<
    SportActivity | OtherActivity.FloorsClimbed | OtherActivity.Steps
  >(SportActivity.Badminton);
  const [isActivityFocus, setIsActivityFocus] = useState(false);
  const metrics = [Metric.Distance, Metric.Calories, Metric.Count].map(
    (value) => ({
      label: prettyName(value),
      value,
    }),
  );
  const [metricValue, setMetricValue] = useState<Metric>(Metric.Distance);
  const [isMetricFocus, setIsMetricFocus] = useState(false);
  const [amountValue, setAmountValue] = useState(100);

  const healthAdapterPromise = getHealthAdapter();

  return __DEV__ || Constants?.expoConfig?.extra?.endtoend ? (
    <>
      <Text
        style={[
          globalStyles.textStyle,
          { fontSize: 32, marginTop: 50, marginBottom: 10 },
        ]}
      >
        Developer tools
      </Text>
      <View>
        <Container>
          <Text style={[styles.headerText]}>Perform activity</Text>
          <Text style={[globalStyles.textStyle, { marginTop: 10 }]}>
            Activity
          </Text>
          <Dropdown
            style={[
              styles.dropdown,
              isActivityFocus && { borderColor: "blue" },
            ]}
            placeholderStyle={globalStyles.smallTitle}
            selectedTextStyle={globalStyles.smallTitle}
            itemTextStyle={globalStyles.smallTitle}
            data={activities}
            labelField="label"
            valueField="value"
            placeholder="Select"
            onFocus={() => setIsActivityFocus(true)}
            onBlur={() => setIsActivityFocus(false)}
            value={activityValue}
            onChange={(item) => {
              setActivityValue(item.value);
              setIsActivityFocus(false);
            }}
            renderRightIcon={() => (
              <UniversalIcon
                source={IconSource.FontAwesome6}
                name="chevron-down"
                size={20}
                color="black"
                style={{
                  transform: [{ rotate: isActivityFocus ? "180deg" : "0deg" }],
                  marginRight: 5,
                }}
              />
            )}
          />
          <Text style={[globalStyles.smallTitle, { marginTop: 10 }]}>
            Metric
          </Text>
          <Dropdown
            style={[styles.dropdown, isMetricFocus && { borderColor: "blue" }]}
            placeholderStyle={globalStyles.smallTitle}
            selectedTextStyle={globalStyles.smallTitle}
            itemTextStyle={globalStyles.smallTitle}
            data={metrics}
            labelField="label"
            valueField="value"
            placeholder="Select"
            onFocus={() => setIsMetricFocus(true)}
            onBlur={() => setIsMetricFocus(false)}
            value={metricValue}
            onChange={(item) => {
              setMetricValue(item.value);
              setIsMetricFocus(false);
            }}
            renderRightIcon={() => (
              <UniversalIcon
                source={IconSource.FontAwesome6}
                name="chevron-down"
                size={20}
                color="black"
                style={{
                  transform: [{ rotate: isMetricFocus ? "180deg" : "0deg" }],
                  marginRight: 5,
                }}
              />
            )}
          />
          <Text style={[globalStyles.smallTitle, { marginTop: 10 }]}>
            Amount
          </Text>
          <TextInput
            style={globalStyles.inputField}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            value={String(amountValue)}
            onChangeText={(text) => setAmountValue(Number(text))}
          ></TextInput>
          <View style={{ width: "50%" }}>
            <TouchableOpacity
              testID="development-exercise-button"
              style={{ marginTop: 10, marginBottom: 5 }}
              onPress={async () => {
                const healthAdapter = await healthAdapterPromise;
                const options = {
                  startDate: new Date(Date.now() - 1000),
                  endDate: new Date(),
                  activity: Constants?.expoConfig?.extra?.endtoend
                    ? OtherActivity.Steps
                    : activityValue,
                };

                if (Constants?.expoConfig?.extra?.endtoend) {
                  setMetricValue(Metric.Count);
                }
                if (isSportInsertOptions(options)) {
                  if (metricValue === Metric.Distance) {
                    options.distance = amountValue;
                    healthAdapter?.insertData(options);
                  } else if (metricValue === Metric.Calories) {
                    options.caloriesBurned = amountValue;
                    healthAdapter?.insertData(options);
                  } else {
                    console.error(
                      "This activity only supports distance and calories",
                    );
                  }
                } else if (isCountOnlyInsertOptions(options)) {
                  if (
                    Constants?.expoConfig?.extra?.endtoend ||
                    metricValue === Metric.Count
                  ) {
                    options.count = amountValue;
                    healthAdapter?.insertData(options);
                  } else {
                    console.error("This activity only supports count");
                  }
                } else {
                  console.error("Unexpected activity type");
                }
                SyncActivity();
              }}
            >
              <Text
                style={[
                  styles.button,
                  { backgroundColor: "#57A773", color: "white" },
                ]}
              >
                Exercise!
              </Text>
            </TouchableOpacity>
          </View>
        </Container>
      </View>
    </>
  ) : null;
}

const styles = StyleSheet.create({
  headerText: {
    ...globalStyles.smallTitle,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    textAlign: "center",
    ...globalStyles.smallTitle,
    borderRadius: 5,
    height: 32,
    lineHeight: 32,
  },
  buttonText: {
    ...globalStyles.smallTitle,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#EFEFF3",
    borderRadius: 8,
  },
  dropdown: {
    backgroundColor: "#EFEFF3",
    borderColor: "black",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
