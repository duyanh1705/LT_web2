import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

//import logo from './img/LogoHITC.png';

const MyDocument = ({ data }: any) => {
  if (!data) return null;

  const { cartId, totalPrice, products } = data;

  const styles = StyleSheet.create({
    page: {
      fontSize: 11,
      paddingTop: 20,
      paddingLeft: 40,
      paddingRight: 40,
      lineHeight: 1.5,
      flexDirection: 'column',
    },
    spaceBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#3E3E3E',
    },
    titleContainer: {
      marginTop: 24,
    },
    logo: {
      width: 200,
    },
    addressTitle: {
      fontSize: 13,
      fontWeight: 'bold',
    },
    address: {
      fontSize: 11,
      fontWeight: 'normal',
    },
    theader: {
      marginTop: 20,
      fontSize: 10,
      fontWeight: 'bold',
      padding: 5,
      flex: 1,
      backgroundColor: '#DEDEDE',
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },
    theader2: {
      flex: 2,
    },
    tbody: {
      fontSize: 9,
      padding: 5,
      flex: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
    },
    tbody2: {
      flex: 2,
    },
    total: {
      fontSize: 10,
      padding: 5,
      flex: 1,
      borderBottomWidth: 1,
      fontWeight: 'bold',
    },
  });

  const InvoiceTitle = () => (
    <View style={styles.titleContainer}>
      <View style={styles.spaceBetween}>
        <Image style={styles.logo} src="/logo.png"/>
      </View>
    </View>
  );

  const UserAddress = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.addressTitle}>
        Email:{' '}
        <Text style={styles.address}>
          {localStorage.getItem('username') || 'N/A'}
        </Text>
      </Text>
      <Text style={styles.addressTitle}>
        Total Price:{' '}
        <Text style={styles.address}>
          {totalPrice.toLocaleString('vi-VN')} đ
        </Text>
      </Text>
    </View>
  );

  const TableHead = () => (
    <View style={{ flexDirection: 'row' }}>
      <View style={[styles.theader, styles.theader2]}>
        <Text>Product</Text>
      </View>
      <View style={styles.theader}>
        <Text>Price</Text>
      </View>
      <View style={styles.theader}>
        <Text>Qty</Text>
      </View>
      <View style={styles.theader}>
        <Text>Amount</Text>
      </View>
    </View>
  );

  const TableBody = () =>
    products.map((p: any) => (
      <View
        key={p.productId}
        style={{ flexDirection: 'row' }}
      >
        <View style={[styles.tbody, styles.tbody2]}>
          <Text>{p.productName}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>{p.price.toLocaleString()}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>{p.quantity}</Text>
        </View>
        <View style={styles.tbody}>
          <Text>
            {(p.price * p.quantity).toLocaleString()}
          </Text>
        </View>
      </View>
    ));

  const TableTotal = () => (
    <View style={{ flexDirection: 'row' }}>
      <View style={[styles.total, styles.tbody2]} />
      <View style={styles.total} />
      <View style={styles.total}>
        <Text>Total</Text>
      </View>
      <View style={styles.total}>
        <Text>{totalPrice.toLocaleString()} đ</Text>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoiceTitle />
        <UserAddress />
        <TableHead />
        <TableBody />
        <TableTotal />
      </Page>
    </Document>
  );
};

export default MyDocument;
