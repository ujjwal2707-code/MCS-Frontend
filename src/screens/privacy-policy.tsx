import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import {Card} from 'react-native-paper';
import CustomText from '@components/ui/custom-text';
import BackBtn from '@components/back-btn';

const PrivacyPolicy = () => {
  return (
    <ScreenLayout>
      <ScreenHeader name="Privacy Policy" />
      <ScrollView
        // contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <Card.Content>
            <CustomText
              variant="h3"
              style={[styles.effectiveDate, styles.center]}>
              Effective Date: 24/02/2025
            </CustomText>

            <CustomText style={styles.bodyText}>
              Thank you for using the MahaCyber Safe App. MahaCyber Safe App
              values your privacy and is committed to protecting your personal
              information. This Privacy Policy outlines how MahaCyber Safe App
              collects, uses, and protects your information when you use our
              App.
            </CustomText>

            <CustomText variant="h4" style={styles.sectionTitle}>
              1. Information MahaCyber Safe App Collects
            </CustomText>
            <CustomText style={styles.bodyText}>
              MahaCyber Safe App may collect the following types of information:
            </CustomText>
            <CustomText style={styles.listItem}>
              •{' '}
              <CustomText style={styles.bold}>Personal Information:</CustomText>{' '}
              The App does not automatically capture any specific personal
              information (such as name, phone number, or email address) that
              identifies you individually unless you voluntarily provide it.
            </CustomText>
            <CustomText style={styles.listItem}>
              •{' '}
              <CustomText style={styles.bold}>
                Technical Information:
              </CustomText>{' '}
              The app can capture the below technical information for scanning
              purposes of any URL or application:
            </CustomText>
            <CustomText style={styles.subListItem}>
              ◦ Internet Protocol (IP) addresses{'\n'}◦ Browser type and version
              {'\n'}◦ Operating system{'\n'}◦ Date and time of your visit{'\n'}◦
              Pages accessed during your visit
            </CustomText>

            <CustomText variant="h4" style={styles.sectionTitle}>
              2. Purpose of Data Collection
            </CustomText>
            <CustomText style={styles.bodyText}>
              Any personal information collected will only be used for the
              following purposes:
            </CustomText>
            <CustomText style={styles.listItem}>
              • To enhance the App's functionality and user experience
            </CustomText>
            <CustomText style={styles.listItem}>
              • To monitor and improve security
            </CustomText>
            <CustomText style={styles.listItem}>
              • To address user queries and provide support services
            </CustomText>
            <CustomText style={styles.bodyText}>
              MahaCyber Safe App will clearly inform you about the purpose for
              which your information is being gathered before any collection
              takes place. If any other information is taken, the user will be
              informed in the privacy policies.
            </CustomText>

            <CustomText variant="h4" style={styles.sectionTitle}>
              3. Security Measures
            </CustomText>
            <CustomText style={styles.bodyText}>
              MahaCyber Safe App implements reasonable security measures to
              protect your personal information from loss, misuse, unauthorized
              access, alteration, or destruction. However, no method of
              electronic storage or transmission is 100% secure, and MahaCyber
              Safe App cannot guarantee its absolute security.
            </CustomText>

            <CustomText variant="h4" style={styles.sectionTitle}>
              4. Third-Party Sharing
            </CustomText>
            <CustomText style={styles.bodyText}>
              MahaCyber Safe App does not sell or share any personal information
              collected through the App with any third party (public or private)
              without your explicit consent, except where required by law.
            </CustomText>

            <CustomText variant="h4" style={styles.sectionTitle}>
              5. Non-Identification of Users
            </CustomText>
            <CustomText style={styles.bodyText}>
              MahaCyber Safe App does not attempt to link the technical
              information it collects (e.g., IP addresses and browser types) to
              individual users unless there is a security concern, such as
              detecting an attempt to damage the App.
            </CustomText>

            <CustomText variant="h4" style={styles.sectionTitle}>
              6. Limitation of Responsibility
            </CustomText>
            <CustomText style={styles.bodyText}>
              While MahaCyber Safe App takes reasonable steps to protect your
              data, MahaCyber or its implementation partner cannot be held
              responsible for any information provided through the App. Users
              are accountable for any information they voluntarily share while
              using the App.
            </CustomText>

            <CustomText variant="h4" style={styles.sectionTitle}>
              7. Limitations of Actions Performed
            </CustomText>
            <CustomText style={styles.bodyText}>
              Although our intention is to offer the safest means for URL
              scanning, application downloading, application installation, QR
              code scanning, OTP security, and preventing data breaches,
              MahaCyber Safe App cannot guarantee complete security.
            </CustomText>

            <CustomText variant="h4" style={styles.sectionTitle}>
              8. Changes to This Privacy Policy
            </CustomText>
            <CustomText style={styles.bodyText}>
              MahaCyber Safe App may update this Privacy Policy from time to
              time. Any changes will be posted in this section with a new
              effective date. Your continued use of the App after any changes
              constitutes your acceptance of the updated policy.
            </CustomText>
          </Card.Content>
        </Card>
      </ScrollView>
      <BackBtn />
    </ScreenLayout>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: '#1B14A1', // #2337A8 // #4E4E96
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical:10
  },
  title: {
    marginTop: 20,
    marginBottom: 10,
    color: '#fff',
  },
  effectiveDate: {
    marginTop: 10,
    marginBottom: 20,
    color: '#fff',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  bodyText: {
    marginBottom: 15,
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 5,
    color: '#fff',
  },
  subListItem: {
    marginLeft: 30,
    marginBottom: 5,
    color: '#fff',
  },
  bold: {
    fontWeight: '600',
  },
  center: {
    textAlign: 'center',
  },
});
